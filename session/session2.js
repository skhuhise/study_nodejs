const express = require('express');
var parseUrl = require('parseurl');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const app = express();

app.use(session({
    secret : 'qwowkcasdwe#2!$',
    resave: false,
    saveUninitialized : true,
    store : new FileStore()
}))

app.get('/', (req, res, next) => {
    console.log(req.session);
    if(req.session.num === undefined) {
        req.session.num = 1;
    } else {
        req.session.num = req.session.num + 1;
    }

    res.send(`Views : ${req.session.num}`);
})
app.listen(3000, () => {
    console.log('3000 port server start!');
})