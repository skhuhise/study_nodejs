var fs = require('fs');
var path = require('path');

module.exports = {
    create:function(request, response, qs) {
        var body= '';
        request.on('data', (data) => {
            body = body + data;
            // 너무 큰 데이터의 전송시 통신 끊음.
            // if(body.length > 1e6)
            //      request.connection.destroy();
        });

        request.on('end', () => {
            var post = qs.parse(body);
            var title = post.title;
            var filteredTitle = path.parse(title).base;
            var description = post.description;

            fs.writeFile(`data/${filteredTitle}`, description, 'utf8', (err) => {
                response.writeHead(302, {Location: `/?id=${filteredTitle}`});
                response.end();
            });
        });
    },

    update:function(request, response, qs) {
        var body= '';
        request.on('data', (data) => {
            body = body + data;
            // 너무 큰 데이터의 전송시 통신 끊음.
            // if(body.length > 1e6)
            //      request.connection.destroy();
        });

        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            var title = post.title;
            var filteredTitle = path.parse(title).base;
            var description = post.description;

            fs.rename(`data/${filteredId}`, `data/${filteredTitle}`, (err) => {
                fs.writeFile(`data/${filteredTitle}`, description, 'utf8', (err) => {
                    response.writeHead(302, {Location: `/?id=${filteredTitle}`});
                    response.end();
                });
            });
        });
    },

    delete:function(request, response, qs) {
        var body= '';
        request.on('data', (data) => {
            body = body + data;
            // 너무 큰 데이터의 전송시 통신 끊음.
            // if(body.length > 1e6)
            //      request.connection.destroy();
        });

        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;

            fs.unlink(`data/${filteredId}`, (err) => {
                response.writeHead(302, {Location: '/'});
                response.end();
            });
        });
    }
}