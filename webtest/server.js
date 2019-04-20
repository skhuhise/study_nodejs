const express = require('express');
const app = express();
var helmet = require('helmet');
var bodyParser = require('body-parser');
var compression = require('compression');
var flash = require('connect-flash');
var sessionRouter = require('./routes/session');

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(sessionRouter);
app.use(flash());

var indexRouter = require('./routes/index');
var authorRouter = require('./routes/author');
var topicRouter = require('./routes/topic');
var errorRouter = require('./routes/error');
var passport = require('./lib/passport')(app);
var authRouter = require('./routes/auth')(passport);


app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);
app.use('/author', authorRouter);
app.use(errorRouter);

app.listen(8090, () => {
    console.log('connect!');
})