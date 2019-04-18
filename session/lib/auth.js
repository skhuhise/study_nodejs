var template = require('./template');
var db = require('../db/db');
var LocalStrategy = require('passport-local').Strategy;

var root = {
    email : 'root',
    password : '123',
    nickname : 'root'
}

exports.login = (req, res, next) => {
    if(req.user) {
        res.redirect('/');
        return false;
    }
    db.query('select * from topic', (topicsError, topics) => {
        if(topicsError) return next(topicsError);

        var title = 'Login';
        var body = `
        <form action="/auth/login" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit" value="create" /></p>
        </form>`;
        var control = '';
        var login = '';
        var list = template.list(topics);
        var html = template.html(title, list, body, control, login);

        res.send(html);
    })
}

exports.loginProcess = new LocalStrategy(
    {
        usernameField : 'email'
    },
    (username, password, done) => {
        if(username === root.email && password === root.password) {
            console.log('?');
            return done(null, root);
        } else {
            console.log('tt');
            return done(null, false, {
                message: 'Incorrect login'
            })
        }
})

exports.logout = (req, res, next) => {
    req.logout();
    req.session.save(function(){
        res.redirect('/');
    });
}

exports.isLogin = (req, res, next) => {
    if(req.user) {
        return true;
    }

    else {
        return false;
    }
}