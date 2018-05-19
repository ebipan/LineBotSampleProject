// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const request = require('request');

// パラメータ設定
const line_config = {
//channelAccessToken: 'アクセストークン',
//channelSecret: 'Channel Secret'
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);



// Webサーバー設定
server.listen(process.env.PORT || 3000);

// ルーター設定
server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    res.sendStatus(200);

// すべてのイベント処理のプロミスを格納する配列。
    let events_processed = [];

    // イベントオブジェクトを順次処理。
    req.body.events.forEach((event) => {
        // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
        if (event.type == "message" && event.message.type == "text"){
          var imgPattern1 = new RegExp(/^画像 .*/);
          var imgPattern2 = new RegExp(/^画像  .*/);

          if (event.message.text.match(imgPattern2)){

            // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
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
                      // replyMessage()で返信し、そのプロミスをevents_processedに追加。
                      events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: "画像の検索に失敗しました。"
                      }));
                      return;
                    }
                    else {
                      // replyMessage()で返信し、そのプロミスをevents_processedに追加。
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
                    // replyMessage()で返信し、そのプロミスをevents_processedに追加。
                    events_processed.push(bot.replyMessage(event.replyToken, {
                      type: "text",
                      text: "画像の検索に失敗しました。"
                    }));
                  }
                  return;
                } catch(e) {
                  console.log("想定外エラー");
                  console.log(e);
                  // replyMessage()で返信し、そのプロミスをevents_processedに追加。
                  events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "text",
                    text: "画像の検索に失敗しました。"
                  }));
                  return;
                }
            });
          }
          else if (event.message.text.match(imgPattern1)){
            // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
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
                          // replyMessage()で返信し、そのプロミスをevents_processedに追加。
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
                      // replyMessage()で返信し、そのプロミスをevents_processedに追加。
                      events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: "画像の検索に失敗しました。"
                      }));
                    }
                    if (imageUrl == null) {
                      console.log("https画像がない");
                      console.log(response);
                      // replyMessage()で返信し、そのプロミスをevents_processedに追加。
                      events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: "画像の検索に失敗しました。"
                      }));
                    }
                    return;
                  } catch(e) {
                    console.log(e);
                    // replyMessage()で返信し、そのプロミスをevents_processedに追加。
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

    // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
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
