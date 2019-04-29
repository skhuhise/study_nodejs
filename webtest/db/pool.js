var mysql = require('promise-mysql')
var connector = require('./connector');

var pool = mysql.createPool(connector);

module.exports = pool