var db = require('../db/db');
var template = require('./template');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

exports.home = (req, res) => {
    db.query(`select * from topic`, (topicError, topics) => {
        if(topicError) throw topicError;
        
        db.query(`select * from author`, (authorError, authors) => {
            var title = 'Author';
            var list = template.list(topics);
            var authorTable = template.authorTable(authors);
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
            <form action="/author/create" method="post">
                <p><input type="text" name="name" placeholder="name"></p>
                <p>
                    <textarea name="profile" placeholder="profile"></textarea>
                </p>
                <input type="submit" value="create" />
            </form>
            `;
            var control = ``;
            var html = template.html(title, list, body, control);

            res.send(html);
        })
    })
}

exports.createProcess = (req, res) => {
    var body= '';
    req.on('data', (data) => {
        body = body + data;
        // 너무 큰 데이터의 전송시 통신 끊음.
        // if(body.length > 1e6)
        //      request.connection.destroy();
    });

    req.on('end', () => {
        var post = qs.parse(body);
        var name = post.name;
        var profile = post.profile;

        db.query('insert into author(name, profile) values(?, ?)', [name, profile], (error, result) => {
            if(error) throw error;
            
            res.writeHead(302, {Location: `/author`});
            res.end();
        })
    });
}

exports.update = (req, res) => {
    var id = req.params.id;

    db.query('select * from topic', (topicsError, topics) => {
        if(topicsError) throw topicsError;

            db.query('select * from author', (authorsError, authors) => {
                if(authorsError) throw authorsError;

                db.query('select * from author where id = ?', [id], (authorError, author) => {
                    if(authorError) throw authorError;

                    var title = 'Author';
                    var authorId = author[0].id;
                    var authorName = author[0].name
                    var authorProfile = author[0].profile;
                    var authorTable = template.authorTable(authors, authorId)
                    var list = template.list(topics);
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
                        <input type="hidden" name="id" value="${authorId}" />
                        <p><input type="text" name="name" placeholder="name" value="${sanitizeHtml(authorName)}"></p>
                        <p>
                            <textarea name="profile" placeholder="profile">${sanitizeHtml(authorProfile)}</textarea>
                        </p>
                        <p>
                            <input type="submit" value="update">
                        </p>
                    </form>`;
                    var control = '';
                    var html = template.html(title, list, body, control);

                    res.send(html);
                })
            })
    })
}

exports.updateProcess = (req, res) => {
    var body= '';
    req.on('data', (data) => {
        body = body + data;
        // 너무 큰 데이터의 전송시 통신 끊음.
        // if(body.length > 1e6)
        //      request.connection.destroy();
    });

    req.on('end', () => {
        var post = qs.parse(body);
        var id = post.id;
        var name = post.name;
        var profile = post.profile;

        db.query('update author set name = ?, profile = ? where id = ?', [name, profile, id], (error, result) => {
            if(error) throw error;

            res.writeHead(302, {Location: `/author`});
            res.end();
        })
    });
}

exports.deleteProcess = (req, res) => {
    var body= '';
    req.on('data', (data) => {
        body = body + data;
        // 너무 큰 데이터의 전송시 통신 끊음.
        // if(body.length > 1e6)
        //      request.connection.destroy();
    });

    req.on('end', () => {
        var post = qs.parse(body);
        var id = post.id;
        
        db.query('delete from topic where author_id = ?', [id], (error, result) => {
            if(error) throw error;

            db.query('delete from author where id = ?', [id], (error, result) => {
                if(error) throw error;
    
                res.writeHead(302, {Location: '/author'});
                res.end();
            })
        })
    });
}