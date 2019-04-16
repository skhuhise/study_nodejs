const express = require('express');
const app = express();
var helmet = require('helmet');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var topicRouter = require('./routes/topic');
var authorRouter = require('./routes/author');
var errorRouter = require('./routes/error');

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
    secret : 'iw!3W1#23!DsTzloI&erjr',
    resave : false,
    saveUninitialized : true
}))

app.use((req, res, next) => {
    req.myMiddle = 'my middleware';
    next();
}) // middleware 생성

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);
app.use('/author', authorRouter);
app.use(errorRouter);

app.listen(8090, () => {
    console.log('connect!');
})