var template = require('./template');
var db = require('../db/db');

var root = {
    email : 'root',
    password : '123',
    nickname : 'root'
}

exports.login = (req, res, next) => {
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
        var session = req.session.email;
        var login = '';
        if(session !== undefined) {
            login = `
            <form action="/auth/logout" method="post">
                <input type="submit" value="logout" />
            </form>`
        }
        
        else {
            login = '<a href="/auth/login">login</a>';
        }
        var list = template.list(topics);
        var html = template.html(title, list, body, control, login);

        res.send(html);
    })
}

exports.loginProcess = (req, res, next) => {
    var post = req.body;
    var email = post.email;
    var password = post.password;

    if(email === root.email&& password === root.password) {
        req.session.email = email;
        req.session.nickname = root.nickname;
        req.session.save(() => {
            res.redirect('/');
        })
    }

    else {
        res.redirect('/');
    }
}

exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        req.session;
        res.redirect('/');
    })
}