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

    db.then(connection => {
        return connection.query('select * from topic')
    }).then(topics => {
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
    }).catch(err => {
        return next(err);
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

    db.then(connection => {
        return connection.query('select * from topic')
    }).then(topics => {
        var title = 'Regist';
        var body = `
        <div style="color : red">${feedback}</div>
        <form action="/auth/regist" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="password" name="passwordValid" placeholder="password"></p>
            <p><input type="text" name="nickname" placeholder="nickname"></p>
            <p><input type="submit" value="create" /></p>
        </form>`;
        var control = '';
        var login = template.login(false);
        var list = template.list(topics);
        var html = template.html(title, list, body, control, login);

        res.send(html);
    }).catch(err => {
        return next(err);
    })
}

exports.registProcess = (req, res, next) => {
    if(req.user) {
        res.redirect('/');
        return false;
    }
    var account = require('../model/account')(req.body);

    db.then(connection => {
        return connection.query('insert into account(email, password, nickname) values(?, ?, ?)', [account.email, account.password, account.nickname])
    }).then(result => {
        res.redirect(`/`);
    }).catch(err => {
        return next(err);
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