var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request, response) {
    var requestUrl = request.url;
    var queryData = url.parse(requestUrl, true).query;
    var title = queryData.id;
    console.log(queryData.id);
    console.log(queryData.name);

    if(requestUrl == '/') {
        title = "Welcome"
   }

   if(requestUrl == '/favicon.ico') {
       response.writeHead(404);
       response.end();
       return;
   }

   response.writeHead(200);
   fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
       if(description == null) description = ' good! it is null';
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
       response.end(template);
   });
});

app.listen(8090);