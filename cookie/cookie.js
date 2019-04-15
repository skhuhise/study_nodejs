const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/', (req, res) => {
    console.log(req.cookies);
    var cookies = {};
    if(req.cookies !== undefined) {
        cookies = req.cookies;
    }

    console.log(cookies);

    console.log(cookies.myCookie);

    res.cookie('myCookie', 'cookie1');
    res.cookie('yourCookie', 'cookie2');
    res.cookie('permanentCookie', 'cookie3', {
        maxAge : 10000
    });
    res.cookie('secureCookie', 'cookie4', {
        secure : true
    })
    res.cookie('httpCookie', 'cookie5', {
        httpOnly : true
    });
    res.cookie('pathCookie', 'cookie6', {
        path : '/',
        secure : false
    })
    res.cookie('domainCookie', 'cookie7', {
        domain : 'mydomain'
    })

    res.send('cookie');
}).listen(3000, () => {
    console.log('server start');
})