var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

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
        <a href="/create">create</a>
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

var viewTest = (id, list, response, callback) => {
    if(id === undefined) {
        var title = 'Welcome';
        var description = 'Hello, good luck';
        callback(title, description, list, response);
    } else {
        fs.readFile(`../data/${id}`, 'utf8', (err, data) => {
            var title = id;
            var description = data;
            callback(title, description, list, response);
        });
    }
}

var creatingTest = (list, response, callback) => {
    fs.readFile(`../form/form.html`, 'utf8', (err, data) => {
        var title = 'creating';
        var description = data;
        callback(title, description, list, response);
    });
}

function testFunc(title, description, list, response) {
    var template = templateHTML(title, list, `<p>${title}${description}</p>`)

    response.writeHead(200);
    response.end(template);
}

// var test = (id, list, callback) => {
//     if(id === undefined) {
//         var title = 'Welcome';
//         var description = 'Hello, good luck';
//         callback(title, description, list);
//     } else {
//         fs.readFile(`../data/${id}`, 'utf8', (err, data) => {
//             var title = id;
//             var description = data;
//             callback(title, description, list);
//         });
//     }
// }

// test(title, list, (title, description, list) => {
//     var template = templateHTML(title, list, `<p>${title}${description}</p>`)

//     response.writeHead(200);
//     response.end(template);
// });

var app = http.createServer(function(request, response) {
    var requestUrl = request.url;
    var queryData = url.parse(requestUrl, true).query;
    var pathName = url.parse(requestUrl, true).pathname;


    if(pathName === '/') {
        fs.readdir('../data', (err, fileList) => {
            var list = templateList(fileList);
            viewTest(queryData.id, list, response, testFunc);
        });
    } else if(pathName === '/create') {
        fs.readdir('../data', (err, fileList) => {
            var list = templateList(fileList);
            creatingTest(list, response, testFunc);
        });
    } else if(pathName === '/create_process') {
        var body= '';
        request.on('data', (data) => {
            body += data;

            // 너무 큰 데이터의 전송시 통신 끊음.
            // if(body.length > 1e6)
            //      request.connection.destroy();
        });

        request.on('end', () => {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            
            console.log(post.title);
        });
       
        response.writeHead(200);
        response.end("testing");
    } else {
        response.writeHead(404);
        response.end("Not found");
    }
});
app.listen(8090);