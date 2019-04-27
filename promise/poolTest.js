var Promise = require('bluebird')
var getSqlConnection = require('./connection')

Promise.using(getSqlConnection(), (conn) => {
    return conn.query('select * from account').then(rows => {
        return console.log(rows)
    }).catch(err => {
        console.log(err)
    })
})

new Promise.using(getSqlConnection(), (conn) => {
    return conn.query('select * from author').then(rows => {
        return console.log(rows)
    }).catch(err => {
        console.log(err)
    })
})