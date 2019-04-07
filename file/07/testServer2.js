var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
    return `
    <!doctype html>
    <html>
    <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">Testing</a></h1>
        <h2>${title}</h2>
        ${list}
        ${body}
    </body>
    </html>
    `;
}

function templateList(fileList) {
    var orderList = '<ol>';
    var unorderList = '<ul>';
    var i = 0;

    while(i < fileList.length) {
        orderList = orderList + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
        unorderList = unorderList + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
        i++;
    }

    orderList += '</ol>';
    unorderList += '</ul>';

    var list = orderList + unorderList;

    return list;
}

var app = http.createServer(function(request, response) {
    var requestUrl = request.url;
    var queryData = url.parse(requestUrl, true).query;
    var pathName = url.parse(requestUrl, true).pathname;


    if(pathName === '/') {
        fs.readdir('../data', (err, fileList) => {
            if(queryData.id === undefined) {
                var title = 'Welcome';
                var description = 'Hello, good luck';
                var list = templateList(fileList);
                var template = templateHTML(title, list, `<p>${title}${description}</p>`)

                response.writeHead(200);
                response.end(template);
            } else {
                fs.readFile(`../data/${queryData.id}`, 'utf8', (err, data) => {
                    var title = queryData.id;
                    var description = data;
                    var list = templateList(fileList);
                    var template = templateHTML(title, list, `<p>${title}${description}</p>`)
    
                    response.writeHead(200);
                    response.end(template);
                });
            }
        });
    } else {
        response.writeHead(404);
        response.end("Not found");
    }
});
app.listen(8090);