var http = require('http');
var url = require('url');
var topic = require('./lib/topic');
var author = require('./lib/author');

var app = http.createServer(function(request, response) {
    var requestUrl = request.url;
    var queryData = url.parse(requestUrl, true).query;
    var pathName = url.parse(requestUrl, true).pathname;

    if(pathName === '/') {
        if(queryData.id === undefined) {
            topic.home(request, response);
        } else {
            topic.page(request, response);
        }
    } else if(pathName === '/create') {
        topic.create(request, response);
    } else if(pathName === '/create_process') {
        topic.createProcess(request, response);
    } else if(pathName === '/update') {
        topic.update(request, response);
    } else if(pathName === '/update_process') {
        topic.updateProcess(request, response);
    } else if(pathName === '/delete_process') {
        topic.deleteProcess(request, response);
    } else if(pathName === '/author') {
        author.home(request, response);
    } else if(pathName === '/author/create_process') {
        author.createProcess(request, response);
    } else if(pathName === '/author/update') {
        author.update(request, response);
    } else if(pathName === '/author/update_process') {
        author.updateProcess(request, response);
    } else if(pathName === '/author/delete_process') {
        author.deleteProcess(request, response);
    } else {
        response.writeHead(404);
        response.end("Not found");
    }
});
app.listen(8090);