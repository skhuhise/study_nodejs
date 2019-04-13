var topic = require('./lib/topic');
var author = require('./lib/author');
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var compression = require('compression');
var myWare = (req, res, next) => {
    req.myWare = 'my middleware method';
    next();
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.use((req, res, next) => {
    req.myMiddle = 'my middleware';
    next();
}) // middleware 생성

app.get('/page/:id', myWare);

app.get('/', (req, res, next) => {
    topic.home(req, res, next);
})

app.get('/page/:id', (req, res, next) => {
    topic.page(req, res, next);
})

app.get('/create', (req, res, next) => {
    topic.create(req, res, next);
})

app.post('/create', (req, res, next) => {
    topic.createProcess(req, res);
})

app.get('/update/:id', (req, res, next) => {
    topic.update(req, res, next);
})

app.post('/update', (req, res, next) => {
    topic.updateProcess(req, res, next);
})

app.post('/delete', (req, res, next) => {
    topic.deleteProcess(req, res, next);
})

app.get('/author', (req, res, next) => {
    author.home(req, res, next);
})

app.post('/author/create', (req, res, next) => {
    author.createProcess(req, res, next);
})

app.get('/author/update/:id', (req, res, next) => {
    author.update(req, res, next);
})

app.post('/author/update', (req, res, next) => {
    author.updateProcess(req, res, next);
})

app.post('/author/delete', (req, res, next) => {
    author.deleteProcess(req, res, next);
})

app.use((req, res, next) => {
    res.status(404).send();
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send();
})

app.listen(8090, () => {
    console.log('connect!');
})