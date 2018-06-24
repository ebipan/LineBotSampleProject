const db = require('../db.js');
const pg = require('pg');
const config = require('config');
const pool = new pg.Pool(config.db.postgres);

// DBにニックネームを登録する
exports.settingNickname = function(event, callback) {
  var query = 'SELECT user_id FROM "user_info" WHERE user_id = $1';
  var param = [event.source.userId];
  db.getOne(query, param, function (err, row) {
    if (err) {
      console.log("DB_ERROR: " + err);
      callback();
    }
    if (row == null || row.length == 0) {
      // 新規ユーザ
      query = 'INSERT INTO "user_info" (user_id, nickname) VALUES($1, $2)';
      var param = [event.source.userId, event.message.text];
      db.insert(query, param, function (err, row) {
        if (err) {
          console.log("DB_ERROR: " + err);
          return;
        }
        console.log("user_infoテーブルにユーザを新規追加した: " + event.source.userId );
        callback();
      });
    }
    else {
      // 既存ユーザ
      query = 'UPDATE "user_info" SET nickname = $2 WHERE user_id = $1';
      var param = [event.source.userId, event.message.text];
      db.update(query, param, function (err, row) {
        if (err) {
          console.log("DB_ERROR: " + err);
        }
        console.log("nicknameを更新した: " +event.source.userId  + ", nickname: "+ event.message.text);
        callback();
      });
    }
  });
}

// DBからニックネームを取得する
exports.gettingNickname = function(event, callback) {
  var query = 'SELECT nickname FROM "user_info" WHERE user_id = $1';
  var param = [event.source.userId];
  db.getOne(query, param, function (err, row) {
    if (err) {
      console.log("DB_ERROR: " + err);
      return;
    }
    if (row == null || row.length == 0) {
      // ニックネーム未登録ユーザ
      callback(null);
    }
    else {
      // ニックネーム登録済みユーザ
      callback(row.nickname);
    }
  });
}

// DBにreststatusを登録する
exports.settingReststatus = function(event, reststatus, callback) {
  var query = 'SELECT reststatus FROM "user_info" WHERE user_id = $1';
  var param = [event.source.userId];
  db.getOne(query, param, function (err, row) {
    if (err) {
      console.log("DB_ERROR: " + err);
      callback();
    }
    if (row == null || row.length == 0) {
      // 新規ユーザ
      query = 'INSERT INTO "user_info" VALUES($1, $2)';
      var param = [event.source.userId, reststatus];
      db.insert(query, param, function (err, row) {
        if (err) {
          console.log("DB_ERROR: " + err);
          return;
        }
        console.log("user_infoテーブルにユーザを新規追加した: " + event.source.userId );
        callback(true);
      });
    }
    else if (row.reststatus != reststatus){
      // 既存ユーザ
      query = 'UPDATE "user_info" SET reststatus = $2 WHERE user_id = $1';
      var param = [event.source.userId, reststatus];
      db.update(query, param, function (err, row) {
        if (err) {
          console.log("DB_ERROR: " + err);
        }
        console.log("reststatusを更新した: " +event.source.userId  + ", reststatus: "+ reststatus);
        callback(true);
      });
    }
    else {
      callback(false);
    }
  });
}

// DBからreststatusを取得する
exports.gettingReststatus = function(event, callback) {
  var query = 'SELECT "reststatus" FROM "user_info" WHERE user_id = $1';
  var param = [event.source.userId];
  db.getOne(query, param, function (err, row) {
    if (err) {
      console.log("DB_ERROR: " + err);
    }
    var restStatus = "";
    if (!row) {
      // 登録がないユーザが店舗検索した場合、デフォルトの検索
      restStatus = "0";
    }
    else {
      restStatus = row.reststatus
    }
    callback(restStatus);
  });
};
