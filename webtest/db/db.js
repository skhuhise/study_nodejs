var mysql = require('promise-mysql');
var connector = require('./connector');

var db = mysql.createConnection(connector);

module.exports = db;