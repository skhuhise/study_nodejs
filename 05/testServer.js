var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request, response) {
    var requestUrl = request.url;
    var queryData = url.parse(requestUrl, true).query;
    var pathName = url.parse(requestUrl, true).pathname;
    console.log(url.parse(requestUrl,true));


    if(pathName === '/') {
        if(queryData.id === undefined) {
            var title = 'Welcome';
            var description = 'Hello, good luck';
            var template =`
            <!doctype html>
            <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">Testing</a></h1>
                <h2>${title}</h2>
                <ol>
                 <li><a href="/?id=HTML">HTML</a></li>
                 <li><a href="/?id=CSS">CSS</a></li>
                 <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ol>
                <ul>
                 <li><a href="/?id=HTML">HTML</a></li>
                 <li><a href="/?id=CSS">CSS</a></li>
                 <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ul>
                <p>${title}${description}</p>
            </body>
            </html>
            `;

            response.writeHead(200);
            response.end(template);
        } else {
            fs.readFile(`data/${queryData.id}`, 'utf8', (err, data) => {
                var title = queryData.id;
                var description = data;
                var template =`
                <!doctype html>
                <html>
                <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">Testing</a></h1>
                    <h2>${title}</h2>
                    <ol>
                     <li><a href="/?id=HTML">HTML</a></li>
                     <li><a href="/?id=CSS">CSS</a></li>
                     <li><a href="/?id=JavaScript">JavaScript</a></li>
                    </ol>
                    <ul>
                     <li><a href="/?id=HTML">HTML</a></li>
                     <li><a href="/?id=CSS">CSS</a></li>
                     <li><a href="/?id=JavaScript">JavaScript</a></li>
                    </ul>
                    <p>${title}${description}</p>
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            });
        }
    } else {
        response.writeHead(404);
        response.end("Not found");
    }
});
app.listen(8090);