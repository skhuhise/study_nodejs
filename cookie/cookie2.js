const express = require('express');
const app = express();
var cookie = require('cookie');

app.get('/', (req, res) => {
    console.log(req.headers.cookie);
    var cookies = {};
    if(req.headers.cookie !== undefined) {
        cookies = cookie.parse(req.headers.cookie);
    }

    console.log(cookies);

    console.log(cookies.myCookie);

    res.writeHead(200, {
        'Set-Cookie': [
            'myCookie=test', 
            'yourCookie=practice',
            `Permanent=PermanentValue; Max-Age=${60*60*24*30}`,
            'Secure=SecureValue; Secure',
            'HttpOnly=HttpOnlyValue; HttpOnly',
            'Path=PathValue; Path=/cookie',
            'Domain=DomainValue; Domain=test.o2.org'
        ]
    });
    res.end('cookie');
}).listen(8085, () => {
    console.log('server start');
})