var db = require('../db/db');
var template = require('./template');
var sanitizeHtml = require('sanitize-html');
var auth = require('./auth');

exports.home = (req, res, next) => {
    db.query(`select * from topic`, (topicsError, topics) => {
        if(topicsError) return next(topicsError);
        
        db.query(`select * from author`, (authorsError, authors) => {
            if(authorsError) return next(authorsError);

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
        })
    })
}

exports.createProcess = (req, res, next) => {
    var isLogin = auth.isLogin(req, res, next);
    if(!isLogin) {
        res.redirect('/');
        return false;
    }
    var author = require('../model/author')(req.body);

    db.query('insert into author(name, profile) values(?, ?)', [author.name, author.profile], (error, result) => {
        if(error) return next(error);
            
        res.redirect(`/author`);
    })
}

exports.update = (req, res, next) => {
    var isLogin = auth.isLogin(req, res, next);
    if(!isLogin) {
        res.redirect('/');
        return false;
    }
    var id = req.params.id;

    db.query('select * from topic', (topicsError, topics) => {
        if(topicsError) return next(topicsError);

            db.query('select * from author', (authorsError, authors) => {
                if(authorsError) return next(authorsError);

                db.query('select * from author where id = ?', [id], (authorError, author) => {
                    if(authorError) return next(authorError);
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
                })
            })
    })
}

exports.updateProcess = (req, res, next) => {
    var isLogin = auth.isLogin(req, res, next);
    if(!isLogin) {
        res.redirect('/');
        return false;
    }

    var author = require('../model/author')(req.body);

    db.query('update author set name = ?, profile = ? where id = ?', [author.name, author.profile, author.id], (error, result) => {
        if(error) return next(erorr);

        res.redirect(`/author`);
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
        
    db.query('delete from topic where authorId = ?', [id], (topicDeleteError, result) => {
        if(topicDeleteError) return next(topicDeleteError);

        db.query('delete from author where id = ?', [id], (authorDeleteError, result) => {
            if(authorDeleteError) return next(authorDeleteError);

            res.redirect('/author');
        })
    })
}