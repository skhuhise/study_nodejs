var template = require('./template');
var db = require('../db/db');
var url= require('url');
var qs = require('querystring');

exports.home = (request, response) => {
    db.query('select * from topic', (error, topics) => {
        if(error) throw error;

        var title = 'Welcome';
        var description = 'Hello, firends!';
        var body = `<h2>${title}</h1>${description}`
        var list = template.list(topics);
        var control = `<a href="/create">create</a>`
        var html = template.html(title, list, body, control);

        response.writeHead(200);
        response.end(html);
    })
}

exports.page = (request, response) => {
    var requestUrl = request.url;
    var queryData = url.parse(requestUrl, true).query;
    var id = queryData.id;
    db.query(`select * from topic`, (topicsError, topics) => {
        if(topicsError) throw topicsError;

        db.query(`select * from topic left join author on topic.author_id = author.id where topic.id = ?`, [id], (topicError, topic) => {
            if(topicError) throw topicError;
            var title = topic[0].title;
            var topicDescription = topic[0].description;
            var authorName = topic[0].name;
            var list = template.list(topics);
            var body = `<h2>${title}</h2>${topicDescription} <p>by ${authorName}</p>`;
            var control = `
            <a href="/create">create</a>
            <a href="/update?id=${id}">update</a>
            <form action="delete_process" method="post">
                <input type="hidden" name="id" value=${id} />
                <input type="submit" value="delete" />
            <form>
            `
            var html = template.html(title, list, body, control);

            response.writeHead(200);
            response.end(html);
        })
    })
}

exports.create = (request, response) => {
    db.query('select * from topic', (topicError, topics) => {
        if(topicError) throw topicError;
        
        db.query('select * from author', (authorError, authors) => {
            if(authorError) throw authorError;
            
            var title = 'Create';
            var authorSelect = template.authorSelect(authors, 0);
            var list = template.list(topics);
            var body = `
            <form action="/create_process" method="post">
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

            response.writeHead(200);
            response.end(html);
        })
    })
}

exports.createProcess = (request, response) => {
    var body= '';
    request.on('data', (data) => {
        body = body + data;
        // 너무 큰 데이터의 전송시 통신 끊음.
        // if(body.length > 1e6)
        //      request.connection.destroy();
    });

    request.on('end', () => {
        var post = qs.parse(body);
        var title = post.title;
        var authorId = post.author;
        var description = post.description;

        db.query('insert into topic(title, description, created, author_id) values(?, ?, now(), ?)', [title, description, authorId], (error, result) => {
            if(error) throw error;
            var id = result.insertId;

            response.writeHead(302, {Location: `/?id=${id}`});
            response.end();
        })
    });
}

exports.update = (request, response) => {
    var requestUrl = request.url;
    var queryData = url.parse(requestUrl, true).query;
    var id = queryData.id;

    db.query('select * from topic', (topicsError, topics) => {
        if(topicsError) throw topicsError;

        db.query(`select * from topic where id = ?`, [id], (topicError, topic) => {
            if(topicError) throw topicError;

            db.query('select * from author', (authorError, authors) => {
                if(authorError) throw authorError;

                var title = 'Update';
                var topicId = topic[0].id;
                var authorId = topic[0].author_id;
                var topicTitle = topic[0].title;
                var topicDescription = topic[0].description;
                var authorSelect = template.authorSelect(authors, authorId)
                var body = `
                <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${topicId}" />
                    <p><input type="text" name="title" placeholder="title" value="${topicTitle}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${topicDescription}</textarea>
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

                response.writeHead(200);
                response.end(html);
            })
        })
    })
}

exports.updateProcess = (request, response) => {
    var body= '';
    request.on('data', (data) => {
        body = body + data;
        // 너무 큰 데이터의 전송시 통신 끊음.
        // if(body.length > 1e6)
        //      request.connection.destroy();
    });

    request.on('end', () => {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var authorId = post.author;
        var description = post.description;

        db.query('update topic set title = ?, description = ?, author_id = ? where id = ?', [title, description, authorId, id], (error, result) => {
            if(error) throw error;

            response.writeHead(302, {Location: `/?id=${id}`});
            response.end();
        })
    });
}

exports.deleteProcess = (request, response) => {
    var body= '';
    request.on('data', (data) => {
        body = body + data;
        // 너무 큰 데이터의 전송시 통신 끊음.
        // if(body.length > 1e6)
        //      request.connection.destroy();
    });

    request.on('end', () => {
        var post = qs.parse(body);
        var id = post.id;
        
        db.query('delete from topic where id = ?', [id], (error, result) => {
            if(error) throw error;

            response.writeHead(302, {Location: '/'});
            response.end();
        })
    });
}