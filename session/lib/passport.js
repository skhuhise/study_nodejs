module.exports = (app) => {
    var root = {
        email : 'root',
        password : '123',
        nickname : 'root'
    }

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user, done) => {
        done(null, user.email);
    })
    passport.deserializeUser((id, done) => {
        done(null, root)
    })

    passport.use(new LocalStrategy(
        {
            usernameField : 'email'
        },
        (username, password, done) => {
            if(username === root.email && password === root.password) {
                return done(null, root, {
                    message : 'Welcome'
                });
            } else {
                console.log('tt');
                return done(null, false, {
                    message: 'Incorrect login'
                });
            }
    }));
    
    return passport;
}