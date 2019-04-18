const express = require('express');
const router = express.Router();
var passport = require('passport');
var root = {
    email : 'root',
    password : '123',
    nickname : 'root'
}

router.use(passport.initialize());
router.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user.email);
})
passport.deserializeUser((id, done) => {
    console.log(id);
    done(null, root)
})

module.exports = router;