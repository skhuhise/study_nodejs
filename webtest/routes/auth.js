const express = require('express');
const router = express.Router();
var auth = require('../lib/auth');
const { check, validationResult } = require('express-validator/check');

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

    router.get('/regist', (req, res, next) => {
        auth.regist(req, res, next);
    })

    router.post('/regist', [
        check('email').isEmail().isLength( { max : 50, min : 5 } ),
        check('password').isLength( { max : 20, min : 4 } ),
        check('passwordValid').exists().custom((value, { req }) => value === req.body.password),
        check('nickname').isLength( { max : 15, min : 1 } )
    ], (req, res, next) => {
        const error = validationResult(req);
        if(!error.isEmpty()) {
            res.redirect('/')
            return false;
        }
        auth.registProcess(req, res, next);
    })

    return router;
}