const express = require('express');
const router = express.Router();
var session = require('express-session');
var sessionkey = require('../private/key/sessionkey');

router.use(session({
    secret : sessionkey,
    resave : false,
    saveUninitialized : false
}))

module.exports = router;