var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request, response) {
    var requestUrl = request.url;
    var queryData = url.parse(requestUrl, true).query;
    console.log(queryData.id);
    console.log(queryData.name);

    if(requestUrl == '/') {
        requestUrl = '/test.html';
   }

   if(requestUrl == '/favicon.ico') {
       response.writeHead(404);
       response.end();
       return;
   }

   response.writeHead(200);
   response.end(queryData.id);
});

app.listen(8090);