const db = require('../db/db');
const template = require('./template');
const sanitizeHtml = require('sanitize-html');
const auth = require('./auth');

exports.home = async (req, res, next) => {
    try {
        const conn = await db;
        let topics = await conn.query(`select * from topic`)
        let authors = await conn.query(`select * from author`);

        let title = 'Author';
        let list = template.list(topics);
        let isLogin = auth.isLogin(req, res, next);
        let login = template.login(isLogin);
        let authorTable = template.authorTable(authors, isLogin);
        let control = '';
        let create = '';

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

        let body = `
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

        let html = template.html(title, list, body, control, login);

        res.send(html);
    } catch(err) {
        return next(err);
    }
}

exports.createProcess = async (req, res, next) => {
    let isLogin = auth.isLogin(req, res, next);

    if(!isLogin) {
        res.redirect('/');
        return false;
    }

    let author = require('../model/author')(req.body);

    try {
        const conn = await db;
        await conn.query('insert into author(name, profile) values(?, ?)', [author.name, author.profile])
        res.redirect(`/author`);
    } catch(err) {
        return next(err);
    }
}

exports.update = async (req, res, next) => {
    let isLogin = auth.isLogin(req, res, next);
    if(!isLogin) {
        res.redirect('/');
        return false;
    }
    
    let id = req.params.id;

    try {
        const conn = await db;
        let topics = await conn.query('select * from topic');
        let authors = await conn.query(`select * from author`);
        let author = await conn.query('select * from author where id = ?', [id]);

        if(author[0] === undefined) return next('route');

        let title = 'Author';
        let authorModel = require('../model/author')(author[0]);
        let list = template.list(topics);
        let login = template.login(isLogin);
        let authorTable = template.authorTable(authors, isLogin);
        let control = '';

        let body = `
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
        

        let html = template.html(title, list, body, control, login);

        res.send(html);
    } catch(err) {
        return next(err);
    }
}

exports.updateProcess = async (req, res, next) => {
    let isLogin = auth.isLogin(req, res, next);
    if(!isLogin) {
        res.redirect('/');
        return false;
    }

    let author = require('../model/author')(req.body);

    try {
        const conn = await db;
        await conn.query('update author set name = ?, profile = ? where id = ?', [author.name, author.profile, author.id]);
        res.redirect(`/author`);
    } catch(err) {
        return next(err);
    }
}

exports.deleteProcess = async (req, res, next) => {
    let isLogin = auth.isLogin(req, res, next);
    if(!isLogin) {
        res.redirect('/');
        return false;
    }
    let post = req.body;
    let id = post.id;

    try {
        const conn = await db;
        await conn.query('delete from topic where authorId = ?', [id]);
        await conn.query('delete from author where id = ?', [id]);
        res.redirect('/author');
    } catch(err) {
        return next(err);
    }
}