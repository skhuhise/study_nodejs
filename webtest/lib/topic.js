var template = require('./template');
var db = require('../db/db');
var sanitizeHtml = require('sanitize-html');
var auth = require('./auth');

exports.home = (req, res, next) => {
    var flashMessage = req.flash();
    var feedback = '';
    if(flashMessage.success) {
        feedback = flashMessage.success[0];
    }

    db.query('select * from topic', (topicsError, topics) => {
        if(topicsError) return next(topicsError);

        var title = 'Welcome';
        var description = 'Hello, firends!';
        var body = `
        <div style="color : red">${feedback}</div>
        <h2>${title}</h1>${description}
        <img src="/image/hello.jpg" style="width:250px; display:block; margin-top:10px;"/>
        `
        var list = template.list(topics);
        var isLogin = auth.isLogin(req, res, next);
        var login = template.login(isLogin);
        var control = '';
        
        if(isLogin)
            var control = `<a href="/topic/form">create</a>`;

        var html = template.html(title, list, body, control, login);

        res.send(html);
    })
}

exports.page = (req, res, next) => {
    var id = req.params.id;

    db.query(`select * from topic`, (topicsError, topics) => {
        if(topicsError) return next(topicsError);

        db.query(`select * from topic left join author on topic.authorId = author.id where topic.id = ?`, [id], (topicError, topic) => {
            if(topicError) return next(topicError);
            if(topic[0] === undefined) return next('route');

            var topicModel = require('../model/topic')(topic[0]);
            var list = template.list(topics);
            var body = `<h2>${sanitizeHtml(topicModel.title)}</h2>${sanitizeHtml(topicModel.description)} <p>by ${sanitizeHtml(topicModel.authorName)}</p>`;
            var isLogin = auth.isLogin(req, res, next);
            var login = template.login(isLogin);
            var control = '';

            if(isLogin)
                var control = `
                    <a href="/topic/form">create</a>
                    <a href="/topic/update/${id}">update</a>
                    <form action="/topic/delete" method="post">
                        <input type="hidden" name="id" value=${id} />
                        <input type="submit" value="delete" />
                    <form>
                    `;

            var html = template.html(topicModel.title, list, body, control, login);

            res.send(html);
        })
    })
}

exports.create = (req, res, next) => {
    db.query('select * from topic', (topicsError, topics) => {
        if(topicsError) return next(topicsError);
        
        db.query('select * from author', (authorsError, authors) => {
            if(authorsError) return next(authorsError);
            
            var title = 'Create';
            var authorSelect = template.authorSelect(authors, 0);
            var list = template.list(topics);
            var body = `
            <form action="/topic/create" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    ${authorSelect}
                </p>
                <p>
                    <input type="submit" value="create">
                </p>
            </form>`;
            var login = `
            <form action="/auth/logout" method="post">
                <input type="submit" value="logout" />
            </form>`
            var control = '';

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
    var topic = require('../model/topic')(req.body);

    db.query('insert into topic(title, description, created, authorId) values(?, ?, now(), ?)', [topic.title, topic.description, topic.authorId], (error, result) => {
        if(error) return next(error);

        var id = result.insertId;
        res.redirect(`/topic/${id}`);
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

        db.query(`select * from topic where id = ?`, [id], (topicError, topic) => {
            if(topicError) return next(topicError);
            if(topic[0] === undefined) return next('route');

            db.query('select * from author', (authorsError, authors) => {
                if(authorsError) return next(authorError);

                var title = 'Update';
                var topicModel = require('../model/topic')(topic[0]);
                var authorSelect = template.authorSelect(authors, topicModel.authorId)
                var body = `
                <form action="/topic/update" method="post">
                    <input type="hidden" name="id" value="${topicModel.id}" />
                    <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topicModel.title)}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${sanitizeHtml(topicModel.description)}</textarea>
                    </p>
                    <p>
                        ${authorSelect}
                    </p>
                    <p>
                        <input type="submit" value="update">
                    </p>
                </form>`;
                var list = template.list(topics);
                var control = '';
                login = `
                    <form action="/auth/logout" method="post">
                        <input type="submit" value="logout" />
                    </form>`

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

    var topic = require('../model/topic')(req.body);

    db.query('update topic set title = ?, description = ?, authorId = ? where id = ?', [topic.title, topic.description, topic.authorId, topic.id], (error, result) => {
        if(error) return next(error);

        res.redirect(`/topic/${topic.id}`);
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
        
    db.query('delete from topic where id = ?', [id], (error, result) => {
        if(error) return next(error);

        res.redirect('/');
    })
}