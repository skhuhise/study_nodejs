const db = require('../db/db');

module.exports = (app) => {
    let passport = require('passport');
    let LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    passport.deserializeUser(async (id, done) => {
        const conn = await db;
        try {
            done(null, await conn.query('select id, email, nickname from account where id = ?', [id]))
        } catch(err) {
            return done(null, false, { message : 'DB ERROR'})
        }
    })

    passport.use(new LocalStrategy(
        {
            usernameField : 'email'
        },
        async (username, password, done) => {
            const conn = await db;
            try {
                let account = await conn.query('select id, email, nickname from account where email = ? and password = ?', [username, password])
                
                if(account[0] === undefined) return done(null, false, { message : 'Incorrect login'});

                return done(null, account[0], {
                    message : 'Welcome'
                })
            } catch(err) {
                return done(null, false, { message: 'DB ERROR'});
            }
        })
    )
    return passport;
}