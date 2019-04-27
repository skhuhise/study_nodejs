var db = require('../db/db');
var template = require('./template');
var sanitizeHtml = require('sanitize-html');
var auth = require('./auth');
var conn;

exports.home = (req, res, next) => {
    var topics;
    var authors;

    db.then(connection => {
        conn = connection;
        return conn.query(`select * from topic`);
    }).then(rows => {
        topics = rows;
        return conn.query(`select * from author`);
    }).then(rows => {
        authors = rows;
        var title = 'Author';
        var list = template.list(topics);
        var isLogin = auth.isLogin(req, res, next);
        var login = template.login(isLogin);
        var authorTable = template.authorTable(authors, isLogin);
        var control = '';
        var create = '';

        if(isLogin) {
            create = `
            <form action="/author/create" method="post">
                <p><input type="text" name="name" placeholder="name"></p>
                <p>
                    <textarea name="profile" placeholder="profile"></textarea>
                </p>
                <input type="submit" value="create" />
            </form>`
        }

        var body = `
        ${authorTable}
        <style>
            table {
                border-collapse: collapse;
            }
            td{
                border:1px solid black;
            }
        </style>
        ${create}
        `;

        var html = template.html(title, list, body, control, login);

        res.send(html);
    }).catch(err => {
        return next(err);
    })
}

exports.createProcess = (req, res, next) => {
    var isLogin = auth.isLogin(req, res, next);
    if(!isLogin) {
        res.redirect('/');
        return false;
    }
    var author = require('../model/author')(req.body);

    db.then(connection => {
        return connection.query('insert into author(name, profile) values(?, ?)', [author.name, author.profile]);
    }).then(result => {
        res.redirect(`/author`);
    }).catch(err => {
        return next(err);
    })
}

exports.update = (req, res, next) => {
    var isLogin = auth.isLogin(req, res, next);
    if(!isLogin) {
        res.redirect('/');
        return false;
    }
    var id = req.params.id;
    var topics;
    var authors;
    var author;

    db.then(connection => {
        conn = connection;
        return conn.query(`select * from topic`);
    }).then(rows => {
        topics = rows;
        return conn.query(`select * from author`);
    }).then(rows => {
        authors = rows;
        return conn.query('select * from author where id = ?', [id]);
    }).then(rows => {
        author = rows;

        if(author[0] === undefined) return next('route');

        var title = 'Author';
        var authorModel = require('../model/author')(author[0]);
        var list = template.list(topics);
        var login = template.login(isLogin);
        var authorTable = template.authorTable(authors, isLogin);
        var control = '';

        var body = `
        ${authorTable}
        <style>
            table {
                border-collapse: collapse;
            }
            td{
                border:1px solid black;
            }
        </style>
        <form action="/author/update" method="post">
            <input type="hidden" name="id" value="${authorModel.id}" />
            <p><input type="text" name="name" placeholder="name" value="${sanitizeHtml(authorModel.name)}"></p>
            <p>
                <textarea name="profile" placeholder="profile">${sanitizeHtml(authorModel.profile)}</textarea>
            </p>
            <p>
                <input type="submit" value="update">
            </p>
        </form>
        `;
        

        var html = template.html(title, list, body, control, login);

        res.send(html);
    }).catch(err => {
        return next(err);
    })
}

exports.updateProcess = (req, res, next) => {
    var isLogin = auth.isLogin(req, res, next);
    if(!isLogin) {
        res.redirect('/');
        return false;
    }

    var author = require('../model/author')(req.body);

    db.then(connection => {
        return connection.query('update author set name = ?, profile = ? where id = ?', [author.name, author.profile, author.id]);
    }).then(result => {
        res.redirect(`/author`);
    }).catch(err => {
        return next(err);
    })
}

exports.deleteProcess = (req, res, next) => {
    var isLogin = auth.isLogin(req, res, next);
    if(!isLogin) {
        res.redirect('/');
        return false;
    }
    var post = req.body;
    var id = post.id;

    db.then(connection => {
        conn = connection;
        return conn.query('delete from topic where authorId = ?', [id]);
    }).then(result => {
        return conn.query('delete from author where id = ?', [id]);
    }).then(result => {
        res.redirect('/author');
    }).catch(err => {
        return next(err);
    })
}