const request = require('request');

exports.imageListSearch = function(event, callback) {
  request.get({
    url: 'https://www.googleapis.com/customsearch/v1',
    qs: {
        key: '',
        cx: '',
        searchType: 'image',
        q: event.message.text,
        lr: 'lang_ja',
        num: '10',
        start: getRandomInt(0,10)
      }
    }, function(error, response, body){
      try {
        if (response) {
          var res = JSON.parse(body);
          var urlPattern = new RegExp(/^https:\/\/.*/);
          var cols = [];
          var count = 0;
          for(var i in res.items) {
            if (res.items[i].link.match(urlPattern)) {
              count++;
              var col = {};
              var action = {
                type: "message",
                label: count,
                text: count
              };
              col.imageUrl = res.items[i].link;
              col.action = action;
              cols.push(col);
            }
            if (i >= 3) {
              break;
            }
          };

          if (cols.length == 0) {
            console.log("https画像がない");
            console.log(response);
            var response = {};
            response.type = "text";
            response.text = "画像の検索に失敗しました。";
            callback(response);
          }
          else {
            var response = {};
            response.type = "template";
            response.altText = "this is a image carousel template"
            response.template = {};
            response.template.type = "image_carousel";
            response.template.columns = cols;
            callback(response);
          }

        } else {
          console.log("レスポンスがない");
          console.log(response);
          var response = {};
          response.type = "text";
          response.text = "画像の検索に失敗しました。";
          callback(response);
        }
        return;
      } catch(e) {
        console.log("想定外エラー");
        console.log(e);
        var response = {};
        response.type = "text";
        response.text = "画像の検索に失敗しました。";
        callback(response);
      }
    }
  );
}

exports.imageSearch = function(event, callback) {
  request.get({
    url: 'https://www.googleapis.com/customsearch/v1',
    qs: {
        key: '',
        cx: '',
        searchType: 'image',
        q: event.message.text,
        lr: 'lang_ja',
        num: '10',
        start: getRandomInt(0,10)
      }
    }, function(error, response, body){
      try {
        if (response) {
          var res = JSON.parse(body);
          var urlPattern = new RegExp(/^https:\/\/.*/);
          var imageUrl = null;
          for(var i in res.items) {
            if(res.items[i].link.match(urlPattern)) {
              imageUrl = res.items[i].link;
                var response = {};
                response.type = "image";
                response.originalContentUrl = imageUrl;
                response.previewImageUrl = imageUrl;
                callback(response);
                break;
              }
            };
          } else {
            console.log("レスポンスがない");
            console.log(response);
            var response = {};
            response.type = "text";
            response.text = "画像の検索に失敗しました。";
            callback(response);
          }
          if (imageUrl == null) {
            console.log("https画像がない");
            console.log(response);
            var response = {};
            response.type = "text";
            response.text = "画像の検索に失敗しました。";
            callback(response);
          }
          return;
        } catch(e) {
          console.log(e);
          var response = {};
          response.type = "text";
          response.text = "画像の検索に失敗しました。";
          callback(response);
        }
    }
  );
}


// minからmaxまでの乱整数を返す関数
function getRandomInt(min, max) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
}
