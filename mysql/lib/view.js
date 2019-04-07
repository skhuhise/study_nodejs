var template = require('./template.js');
var fs = require('fs');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

module.exports = {
    main:(id, list, response, callback) => {
        if(id === undefined) {
            var title = 'Welcome';
            var description = 'Hello, good luck';
            var control = `<a href="/create">create</a>`
            callback(title, description, list, control, response);
        } else {
            var filteredId = path.parse(id).base;
            fs.readFile(`../data/${filteredId}`, 'utf8', (err, data) => {
                var title = filteredId;
                var description = data;
                var sanitizedTitle = sanitizeHtml(title);
                var sanitizedDescription = sanitizeHtml(description, {
                    allowedTags:['h1']
                });
                var control = `
                <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                    <input type="hidden" name="id" value=${sanitizedTitle} />
                    <input type="submit" value="delete" />
                <form>
                `
                callback(sanitizedTitle, sanitizedDescription, list, control, response);
            });
        }
    },

    create:(list, response, callback) => {
        fs.readFile(`../form/create.html`, 'utf8', (err, data) => {
            var title = 'creating';
            var description = data;
            callback(title, description, list, '', response);
        });
    },

    update:(id, list, response, callback) => {
        var filteredId = path.parse(id).base;
        fs.readFile(`../data/${filteredId}`, 'utf8', (err, data) => {
            var title = filteredId;
            var description = data;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags:['h1']
            });
            var html = `
            <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}" />
                <p><input type="text" name="title" placeholder="title" value="${sanitizedTitle}"></p>
                <p>
                    <textarea name="description" placeholder="description">${sanitizedDescription}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>s
            </form>
            `;
            callback(sanitizedTitle, html, list, '', response);
        });
    },

    func:function(title, description, list, control, response) {
        var html = template.html(title, list, `<p>${title}${description}</p>`, control);
    
        response.writeHead(200);
        response.end(html);
    }
}