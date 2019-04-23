var mysql = require('promise-mysql')
var connector = require('./connector');

var db = mysql.createConnection(connector);
var connection;

db.then((conn) => {
    connection = conn;
    var id = 1;
    var account = connection.query('select * from account where id = ?', [id]);
    return account
}).then((rows) => {
    console.log('rows1 :', rows);
    var topic = connection.query('select * from topic');
    return topic;
}).then((rows) => {
    console.log('rows2 :', rows)
    var temp = connection.query('select * from topic where id = ?', [rows[0].id])
    connection.end();
    return temp;
}).then((rows) => {
    console.log('rows3 :', rows);
}).catch((error) => {
    if(connection && connection.end) connection.end();

    console.log(error);
})