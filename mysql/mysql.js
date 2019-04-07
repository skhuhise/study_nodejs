var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'test',
    password:'test123',
    database:'studyfornodejs'
});

connection.connect();

connection.query('select * from topic', (error, results, fields) => {
    if(error) {
        console.log(error);
    }

    console.log(results);
    console.log(results[0]);
    console.log(results[0].title);
});

connection.end();