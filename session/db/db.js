var mysql = require('mysql');
var connector = require('./connector');

var db = mysql.createConnection(connector);

db.connect();

module.exports = db;