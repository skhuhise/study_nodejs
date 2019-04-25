var mysql = require('promise-mysql')
var connector = require('./poolcon');

var pool = mysql.createPool(connector);

pool.query('select * from topic').then((rows) => {
    return console.log('topic : ', rows);
})

pool.getConnection().then((conn) => {
    conn.query('select * from author').then((rows) => {
        return console.log('author : ', rows);
    })
}).catch((err) => {
    done(err);
})