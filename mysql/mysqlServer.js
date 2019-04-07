var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var view = require('./lib/view.js');
var process = require('./lib/process.js');
var mysql = require('mysql');

var db = mysql.createConnection({
    host:'localhost',
    user:'test',
    password:'test123',
    database:'studyfornodejs'
});

db.connect();

var app = http.createServer(function(request, response) {
    var requestUrl = request.url;
    var queryData = url.parse(requestUrl, true).query;
    var pathName = url.parse(requestUrl, true).pathname;


    if(pathName === '/') {
        if(queryData.id === undefined) {
            db.query('select * from topic', (error, topics) => {
                if(error) throw error;

                var title = 'Welcome';
                var description = 'Hello, firends!';
                var list = template.list(topics);
                var control = `<a href="/create">create</a>`
                var html = template.html(title, list, `<h2>${title}</h1>${description}`, control);
                response.writeHead(200);
                response.end(html);
            })
        } else {
            db.query(`select * from topic`, (topicsError, topics) => {
                if(topicsError) throw topicsError;

                db.query(`select * from topic where id = ?`, [queryData.id], (topicError, topic) => {
                    if(topicError) throw topicError;
    
                    var title = topic[0].title;
                    var description = topic[0].description;
                    var list = template.list(topics);
                    var control = `
                    <a href="/create">create</a>
                    <a href="/update?id=${queryData.id}">update</a>
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value=${queryData.id} />
                        <input type="submit" value="delete" />
                    <form>
                    `
                    var html = template.html(title, list, `<h2>${title}</h2>${description}`, control);
                    response.writeHead(200);
                    response.end(html);
                })
            })
        }
    } else if(pathName === '/create') {
        db.query('select * from topic', (error, topics) => {
            if(error) throw error;

            var title = 'Create';
            var description = `
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>`;
            var list = template.list(topics);
            var control = '';
            var html = template.html(title, list, description, control);
            response.writeHead(200);
            response.end(html);
        })
    } else if(pathName === '/create_process') {
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
            var description = post.description;

            db.query('insert into topic(title, description, created, author_id) values(?, ?, now(), ?)', [title, description, 1], (error, result) => {
                if(error) throw error;

                response.writeHead(302, {Location: `/?id=${result.insertId}`});
                response.end();
            })
        });
        
    } else if(pathName === '/update') {
        db.query('select * from topic', (topicsError, topics) => {
            if(topicsError) throw topicsError;

            db.query(`select * from topic where id = ?`, [queryData.id], (topicError, topic) => {
                if(topicError) throw topicError;

                var title = 'Update';
                var description = `
                <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${topic[0].id}" />
                    <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>`;
                var list = template.list(topics);
                var control = '';
                var html = template.html(title, list, description, control);
                response.writeHead(200);
                response.end(html);
            })
        })
    } else if(pathName === '/update_process') {
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
            var description = post.description;

            db.query('update topic set title = ?, description = ?, author_id = 1 where id = ?', [title, description, id], (error, result) => {
                if(error) throw error;

                response.writeHead(302, {Location: `/?id=${id}`});
                response.end();
            })
        });
    } else if(pathName === '/delete_process') {
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
    } else {
        response.writeHead(404);
        response.end("Not found");
    }
});
app.listen(8090);