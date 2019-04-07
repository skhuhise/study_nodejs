var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var view = require('./lib/view.js');
var process = require('./lib/process.js');

var app = http.createServer(function(request, response) {
    var requestUrl = request.url;
    var queryData = url.parse(requestUrl, true).query;
    var pathName = url.parse(requestUrl, true).pathname;


    if(pathName === '/') {
        fs.readdir('data', (err, fileList) => {
            var list = template.list(fileList);
            view.main(queryData.id, list, response, view.func);
        });
    } else if(pathName === '/create') {
        fs.readdir('data', (err, fileList) => {
            var list = template.list(fileList);
            view.create(list, response, view.func);
        });
    } else if(pathName === '/create_process') {
        process.create(request, response, qs);
    } else if(pathName === '/update') {
        fs.readdir('data', (err, fileList) => {
            var list = template.list(fileList);
            view.update(queryData.id, list, response, view.func);
        });
    } else if(pathName === '/update_process') {
        process.update(request, response, qs);
    } else if(pathName === '/delete_process') {
        process.delete(request, response, qs);
    } else {
        response.writeHead(404);
        response.end("Not found");
    }
});
app.listen(8090);