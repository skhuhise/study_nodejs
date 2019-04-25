var mysql = require('promise-mysql')
var connector = require('./poolcon')

pool = mysql.createPool(connector)

function getSqlConnection() {
    return pool.getConnection().disposer((conn) => {
        pool.releaseConnection(conn)
    })
}

module.exports = getSqlConnection