const express = require('express');
const router = express.Router();
var auth = require('../lib/auth');
var passport = require('passport')

router.get('/login', (req, res, next) => {
    auth.login(req, res, next);
})

passport.use(auth.loginProcess);

router.post('/login', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/auth/login'
}))

router.post('/logout', (req, res, next) => {
    auth.logout(req, res, next);
})

module.exports = router;