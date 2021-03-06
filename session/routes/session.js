const express = require('express');
const router = express.Router();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var connector = require('../db/connector');
var sessionkey = require('../private/key/sessionkey');

var sessionStore = new MySQLStore(connector);

router.use(session({
    secret : sessionkey,
    resave : false,
    saveUninitialized : false,
    store : sessionStore
}))

module.exports = router;