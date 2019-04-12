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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.use((req, res, next) => {
    req.myMiddle = 'my middleware';
    next();
}) // middleware 생성

app.get('/page/:id', myWare);

app.get('/', (req, res) => {
    topic.home(req, res);
})

app.get('/page/:id', (req, res) => {
    topic.page(req, res);
})

app.get('/create', (req, res) => {
    topic.create(req, res);
})

app.post('/create', (req, res) => {
    topic.createProcess(req, res);
})

app.get('/update/:id', (req, res) => {
    topic.update(req, res);
})

app.post('/update', (req, res) => {
    topic.updateProcess(req, res);
})

app.post('/delete', (req, res) => {
    topic.deleteProcess(req, res);
})

app.get('/author', (req, res) => {
    author.home(req, res);
})

app.post('/author/create', (req, res) => {
    author.createProcess(req, res);
})

app.get('/author/update/:id', (req, res) => {
    author.update(req, res);
})

app.post('/author/update', (req, res) => {
    author.updateProcess(req, res);
})

app.post('/author/delete', (req, res) => {
    author.deleteProcess(req, res);
})

app.listen(8090, () => {
    console.log('connect!');
})