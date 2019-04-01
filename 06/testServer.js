var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request, response) {
    var requestUrl = request.url;
    var queryData = url.parse(requestUrl, true).query;
    var pathName = url.parse(requestUrl, true).pathname;


    if(pathName === '/') {
        if(queryData.id === undefined) {
            
            fs.readdir('../data', (err, fileList) => {
                console.log(fileList);

                var title = 'Welcome';
                var description = 'Hello, good luck';
                
                var orderList = '<ol>';
                var unorderList = '<ul>';
                var i = 0;
                while(i < fileList.length) {
                    orderList = orderList + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
                    unorderList += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
                    i++;
                }

                orderList = orderList + '</ol>';
                unorderList += '</ul>';

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
                    ${orderList}
                    ${unorderList}
                    <p>${title}${description}</p>
                </body>
                </html>
                `;
    
                response.writeHead(200);
                response.end(template);
            });
            
        } else {

            fs.readdir('../data', (err, fileList) => {
                console.log(fileList);

                var orderList = '<ol>';
                var unorderList = '<ul>';
                var i = 0;
                while(i < fileList.length) {
                    orderList = orderList + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
                    unorderList += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
                    i++;
                }

                orderList = orderList + '</ol>';
                unorderList += '</ul>';
                fs.readFile(`../data/${queryData.id}`, 'utf8', (err, data) => {
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
                        ${orderList}
                        ${unorderList}
                        <p>${title}${description}</p>
                    </body>
                    </html>
                    `;

                    response.writeHead(200);
                    response.end(template);
                });
            });
            
        }
    } else {
        response.writeHead(404);
        response.end("Not found");
    }
});
app.listen(8090);