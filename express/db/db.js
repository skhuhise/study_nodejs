var mysql = require('mysql');

var db = mysql.createConnection({
    host:'localhost',
    user:'test',
    password:'test123',
    database:'studyfornodejs'
});

db.connect();

module.exports = db;