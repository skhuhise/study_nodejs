var db = require('../db/db');

module.exports = (app) => {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    passport.deserializeUser((id, done) => {
        db.query('select id, email, nickname from account where id = ?', [id], (accountError, account) => {
            done(null, account)
        })
    })

    passport.use(new LocalStrategy(
        {
            usernameField : 'email'
        },
        (username, password, done) => {
            db.query('select id, email, nickname from account where email = ? and password = ?', [username, password], (accountError, account) => {
                if(accountError) return done(null, false, { message: 'DB ERROR'});
                if(account[0] === undefined) return done(null, false, { message : 'Incorrect login'});

                return done(null, account[0], {
                    message : 'Welcome'
                })
            })
        })
    )

    return passport;
}