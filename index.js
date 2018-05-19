const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const request = require('request');

const line_config = {
//channelAccessToken: 'アクセストークン',//channelSecret: 'Channel Secret'
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};

const bot = new line.Client(line_config);



server.listen(process.env.PORT || 3000);

server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    res.sendStatus(200);

    let events_processed = [];

    req.body.events.forEach((event) => {
        if (event.type == "message" && event.message.type == "text"){
          var imgPattern1 = new RegExp(/^画像 .*/);
          var imgPattern2 = new RegExp(/^画像  .*/);

          if (event.message.text.match(imgPattern2)){
            var test = request.get({
              url: 'https://www.googleapis.com/customsearch/v1',
              qs: {
                  key: 'AIzaSyDmcxG1n9uhxHZblGKhVed12IRLoNocc2c',
                  cx: '016452044916959564506:p8pjdbjgltq',
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
                      events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: "画像の検索に失敗しました。"
                      }));
                      return;
                    }
                    else {
                      events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "template",
                        altText: "this is a image carousel template",
                        template: {
                            type: "image_carousel",
                            columns: cols
                        }
                      }));
                    }

                  } else {
                    console.log("レスポンスがない");
                    console.log(response);
                    events_processed.push(bot.replyMessage(event.replyToken, {
                      type: "text",
                      text: "画像の検索に失敗しました。"
                    }));
                  }
                  return;
                } catch(e) {
                  console.log("想定外エラー");
                  console.log(e);
                  events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: "画像の検索に失敗しました。"
                  }));
                  return;
                }
            });
          }
          else if (event.message.text.match(imgPattern1)){
            var test = request.get({
              url: 'https://www.googleapis.com/customsearch/v1',
              qs: {
                  key: 'AIzaSyDmcxG1n9uhxHZblGKhVed12IRLoNocc2c',
                  cx: '016452044916959564506:p8pjdbjgltq',
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
                          events_processed.push(bot.replyMessage(event.replyToken, {
                              type: "image",
                              originalContentUrl: imageUrl,
                              previewImageUrl: imageUrl
                          }));
                          break;
                        }
                      };
                    } else {
                      console.log("レスポンスがない");
                      console.log(response);
                      events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: "画像の検索に失敗しました。"
                      }));
                    }
                    if (imageUrl == null) {
                      console.log("https画像がない");
                      console.log(response);
                      events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: "画像の検索に失敗しました。"
                      }));
                    }
                    return;
                  } catch(e) {
                    console.log(e);
                    events_processed.push(bot.replyMessage(event.replyToken, {
                      type: "text",
                      text: "画像の検索に失敗しました。"
                    }));
                    return;
                  }
              });
          }

        }
    });

    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );

});

// minからmaxまでの乱整数を返す関数
function getRandomInt(min, max) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
}
