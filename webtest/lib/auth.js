var template = require('./template');
var db = require('../db/db');

exports.login = (req, res, next) => {
    if(req.user) {
        res.redirect('/');
        return false;
    }
    var flashMessage = req.flash();
    var feedback = '';
    if(flashMessage.error) {
        feedback = flashMessage.error[0];
    }
    db.query('select * from topic', (topicsError, topics) => {
        if(topicsError) return next(topicsError);

        var title = 'Login';
        var body = `
        <div style="color : red">${feedback}</div>
        <form action="/auth/login" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit" value="create" /></p>
        </form>`;
        var control = '';
        var login = template.login(false);
        var list = template.list(topics);
        var html = template.html(title, list, body, control, login);

        res.send(html);
    })
}

exports.regist = (req, res, next) => {
    if(req.user) {
        res.redirect('/');
        return false;
    }
    var flashMessage = req.flash();
    var feedback = '';
    if(flashMessage.error) {
        feedback = flashMessage.error[0];
    }
    db.query('select * from topic', (topicsError, topics) => {
        if(topicsError) return next(topicsError);

        var title = 'Regist';
        var body = `
        <div style="color : red">${feedback}</div>
        <form action="/auth/regist" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="password" name="passwordValid" placeholder="password"></p>
            <p><input type="nickname" name="nickname" placeholder="nickname"></p>
            <p><input type="submit" value="create" /></p>
        </form>`;
        var control = '';
        var login = template.login(false);
        var list = template.list(topics);
        var html = template.html(title, list, body, control, login);

        res.send(html);
    })
}

exports.registProcess = (req, res, next) => {
    if(req.user) {
        res.redirect('/');
        return false;
    }
    var post = req.body;
    var email = post.email;
    var password = post.password;
    var passwordValid = post.passwordValid;
    var nickname = post.nickname;


    if(password !== passwordValid) {
        console.log('asd');
        res.redirect('/auth/regist')
        return false;
    }

    db.query('insert into account(email, password, nickname) values(?, ?, ?)', [email, password, nickname], (error, result) => {
        if(error) return next(error);

        console.log('??');
        res.redirect(`/`);
     })
}

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