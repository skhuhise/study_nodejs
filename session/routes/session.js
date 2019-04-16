const express = require('express');
const router = express.Router();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var connector = require('../db/connector');

var sessionStore = new MySQLStore(connector);

router.use(session({
    secret : 'iw!3W1#23!DsTzloI&erjr',
    store : sessionStore,
    resave : false,
    saveUninitialized : true
}))

module.exports = router;