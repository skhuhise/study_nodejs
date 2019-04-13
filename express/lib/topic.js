var template = require('./template');
var db = require('../db/db');
var sanitizeHtml = require('sanitize-html');

exports.home = (req, res, next) => {
    console.log(req.myMiddle);
    console.log(req.myWare);
    db.query('select * from topic', (topicsError, topics) => {
        if(topicsError) return next(topicsError);

        var title = 'Welcome';
        var description = 'Hello, firends!';
        var body = `
        <h2>${title}</h1>${description}
        <img src="/image/hello.jpg" style="width:250px; display:block; margin-top:10px;"/>
        `
        var list = template.list(topics);
        var control = `<a href="/create">create</a>`
        var html = template.html(title, list, body, control);

        res.send(html);
    })
}

exports.page = (req, res, next) => {
    console.log(req.myMiddle);
    console.log(req.myWare);
    var id = req.params.id;
    db.query(`select * from topic`, (topicsError, topics) => {
        if(topicsError) return next(topicsError);

        db.query(`select * from topic left join author on topic.author_id = author.id where topic.id = ?`, [id], (topicError, topic) => {
            if(topicError) return next(topicError);
            if(topic[0] === undefined) return next('route');
            
            var title = topic[0].title;
            var topicDescription = topic[0].description;
            var authorName = topic[0].name;
            var list = template.list(topics);
            var body = `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(topicDescription)} <p>by ${sanitizeHtml(authorName)}</p>`;
            var control = `
            <a href="/create">create</a>
            <a href="/update/${id}">update</a>
            <form action="../delete" method="post">
                <input type="hidden" name="id" value=${id} />
                <input type="submit" value="delete" />
            <form>
            `
            var html = template.html(title, list, body, control);

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
            <form action="/create" method="post">
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
            var control = '';
            var html = template.html(title, list, body, control);

            res.send(html);
        })
    })
}

exports.createProcess = (req, res, next) => {
    var post = req.body;
    var title = post.title;
    var authorId = post.author;
    var description = post.description;

    db.query('insert into topic(title, description, created, author_id) values(?, ?, now(), ?)', [title, description, authorId], (error, result) => {
        if(error) return next(error);

        var id = result.insertId;
        res.redirect(302, `/page/${id}`);
    })
}

exports.update = (req, res, next) => {
    var id = req.params.id;

    db.query('select * from topic', (topicsError, topics) => {
        if(topicsError) return next(topicsError);

        db.query(`select * from topic where id = ?`, [id], (topicError, topic) => {
            if(topicError) return next(topicError);
            if(topic[0] === undefined) return next('route');

            db.query('select * from author', (authorsError, authors) => {
                if(authorsError) return next(authorError);

                var title = 'Update';
                var topicId = topic[0].id;
                var authorId = topic[0].author_id;
                var topicTitle = topic[0].title;
                var topicDescription = topic[0].description;
                var authorSelect = template.authorSelect(authors, authorId)
                var body = `
                <form action="/update" method="post">
                    <input type="hidden" name="id" value="${topicId}" />
                    <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topicTitle)}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${sanitizeHtml(topicDescription)}</textarea>
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
                var html = template.html(title, list, body, control);
                console.log(topicId);

                res.send(html);
            })
        })
    })
}

exports.updateProcess = (req, res, next) => {
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var authorId = post.author;
    var description = post.description;

    db.query('update topic set title = ?, description = ?, author_id = ? where id = ?', [title, description, authorId, id], (error, result) => {
        if(error) return next(error);

        res.redirect(302, `/page/${id}`);
    })
}

exports.deleteProcess = (req, res, next) => {
    var post = req.body;
    var id = post.id;
        
    db.query('delete from topic where id = ?', [id], (error, result) => {
        if(error) return next(error);

        res.redirect(302, '/');
    })
}