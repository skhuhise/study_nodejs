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
        db.then(connection => {
            return connection.query('select id, email, nickname from account where id = ?', [id])
        }).then(account => {
            done(null, account)
        }).catch(err => {
            return done(null, false, { message : 'DB ERROR'});
        })
    })

    passport.use(new LocalStrategy(
        {
            usernameField : 'email'
        },
        (username, password, done) => {
            db.then(connection => {
                return connection.query('select id, email, nickname from account where email = ? and password = ?', [username, password])
            }).then(account => {
                if(account[0] === undefined) return done(null, false, { message : 'Incorrect login'});

                return done(null, account[0], {
                    message : 'Welcome'
                })
            }).catch(err => {
                return done(null, false, { message: 'DB ERROR'});
            })
        })
    )
    return passport;
}