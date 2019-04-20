const express = require('express');
const router = express.Router();
var topic = require('../lib/topic');

var myWare = (req, res, next) => {
    req.myWare = 'my middleware method';
    next();
}

router.get('/:id', myWare);

router.get('/:id', (req, res, next) => {
    topic.page(req, res, next);
})

router.get('/form', (req, res, next) => {
    topic.create(req, res, next);
})

router.post('/create', (req, res, next) => {
    topic.createProcess(req, res);
})

router.get('/update/:id', (req, res, next) => {
    topic.update(req, res, next);
})

router.post('/update', (req, res, next) => {
    topic.updateProcess(req, res, next);
})

router.post('/delete', (req, res, next) => {
    topic.deleteProcess(req, res, next);
})

module.exports = router;