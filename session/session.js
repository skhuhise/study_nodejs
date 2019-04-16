const express = require('express');
var parseUrl = require('parseurl');
var session = require('express-session');

const app = express();

app.use(session({
    secret : 'test',
    resave: false,
    saveUninitialized : true
}))

app.use((req, res, next) => {
    if(!req.session.test) {
        req.session.test = {};
    }

    var pathName = parseUrl(req).pathname;
    req.session.test[pathName] = (req.session.test[pathName] || 0) + 1;
    next();
})

app.get('/test1', (req, res, next) => {
    res.send('test1 request session test: ' + req.session.test['/test1'] + ' times');
    console.log(req.session);
    console.log();
    console.log(req.session.test);
    console.log();
    console.log('/test1 : ' + req.session.test['/test1']);
    console.log('/test2 : ' + req.session.test['/test2']);
})

app.get('/test2', (req, res, next) => {
    res.send('test2 request session test: ' + req.session.test['/test2'] + ' times');
    console.log(req.session);
    console.log();
    console.log(req.session.test);
    console.log();
    console.log('/test1 : ' + req.session.test['/test1']);
    console.log('/test2 : ' + req.session.test['/test2']);
})

app.listen(3000, () => {
    console.log('3000 port server start!');
})