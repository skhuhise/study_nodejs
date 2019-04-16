const express = require('express');
const router = express.Router();
var auth = require('../lib/auth');

router.get('/login', (req, res, next) => {
    auth.login(req, res, next);
})

router.post('/login', (req, res, next) => {
    auth.loginProcess(req, res, next);
})

router.post('/logout', (req, res, next) => {
    auth.logout(req, res, next);
})

module.exports = router;