const request = require('request');
const settingUserInfo = require('./settingUserInfo.js');

exports.lunchSearch = function(event, callback) {
  settingUserInfo.gettingReststatus(event, function(reststatus) {
    var response = {};
    response.type = "text";
    if (event.message.latitude && event.message.longitude) {
      var req = request.get({
        url: 'https://api.gnavi.co.jp/RestSearchAPI/20150630',
        qs: {
            keyid: '',
            format: 'json',
            latitude: event.message.latitude,
            longitude: event.message.longitude,
            hit_per_page: '1',
            lunch: reststatus
          }
        }, function(error, res, body){
          try {
            if (body) {
              var bodyObj = JSON.parse(body);
              if (bodyObj.error) {
                if (bodyObj.error.code === "600") {
                  response.text = "この付近には該当する飲食店が存在しませんでした。";
                }
                else {
                  console.log("想定外エラー");
                  console.log(e);
                  response.text = "お店の検索に失敗しました。";
                }
                callback(response);
              }
              else {
                var restName = bodyObj.rest.name;
                var restUrl = bodyObj.rest.url;
                if (reststatus === "1") {
                  response.text = "この付近500mでランチ営業を行っている飲食店を検索した結果\n\n「" + restName + "」\nというお店がありました。\n\n" + restUrl;
                }
                else {
                  response.text = "この付近500mで飲食店を検索した結果\n\n「" + restName + "」\nというお店がありました。\n\n" + restUrl;
                }
                callback(response);
              }
              return;
            }

          } catch(e) {
            console.log("想定外エラー");
            console.log(e);
            response.text = "お店の検索に失敗しました。";
            callback(response);
          }
        }
      );
    }
    else {
      response.text = "お店の検索に失敗しました。";
      callback(response);
    }
  });
}
