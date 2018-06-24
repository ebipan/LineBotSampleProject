const pg = require('pg');
const config = require('config');
const pool = new pg.Pool(config.db.postgres);

exports.getOne= function(query, param, callback) {
  pool.connect(function(err, client, done) {
    client.query(query, param, function(err, result) {
      done();
      if(err) {
        callback(err);
      }
      else {
        console.log("DBにSELECT(ONE)をおこなった" + query + ", param: " + param);
        callback(null, (result == null || result.rows.length < 1) ? null : result.rows[0]);
      }
    });
  });
}

exports.getAll= function(query, callback) {

}

exports.insert= function(query, param, callback) {
  pool.connect(function(err, client, done) {
    client.query(query, param, function(err, result) {
      done();
      if(err) {
        callback(err);
      }
      else {
        console.log("DBにINSERTをおこなった" + query + ", param: " + param + ", 挿入数:" + result.rowCount);
        callback(null, result);
      }
    });
  });
}

exports.update= function(query, param, callback) {
  pool.connect(function(err, client, done) {
    client.query(query, param, function(err, result) {
      done();
      if(err) {
        callback(err);
      }
      else {
        console.log("DBにUPDATEをおこなった" + query + ", param: " + param + ", 挿入数:" + result.rowCount);
        callback(null, result);
      }
    });
  });
}

exports.delete= function(query, callback) {

}
