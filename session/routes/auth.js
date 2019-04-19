const express = require('express');
const router = express.Router();
var auth = require('../lib/auth');

module.exports = (passport) => {
    router.get('/login', (req, res, next) => {
        auth.login(req, res, next);
    })

    router.post('/login', passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect : '/auth/login',
        failureFlash : true,
        successFlash : true
    }))

    router.post('/logout', (req, res, next) => {
        auth.logout(req, res, next);
    })

    return router;
}