const express = require('express');
const router = express.Router();
var topic = require('../lib/topic');
const { check, validationResult } = require('express-validator/check');

router.get('/:id', (req, res, next) => {
    topic.page(req, res, next);
})

router.get('/form', (req, res, next) => {
    topic.create(req, res, next);
})

router.post('/create', [
    check('title').isLength({ max : 20, min : 1 }),
    check('description').exists(),
    check('authorId').isNumeric()
], (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect('/')
        return false;
    }
    topic.createProcess(req, res);
})

router.get('/update/:id', (req, res, next) => {
    topic.update(req, res, next);
})

router.post('/update', [
    check('id').isNumeric(),
    check('title').isLength({ max : 20, min : 1}),
    check('description').exists(),
    check('authorId').isNumeric()
], (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect('/')
        return false;
    }
    topic.updateProcess(req, res, next);
})

router.post('/delete', check('id').isNumeric(), (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect('/')
        return false;
    }
    topic.deleteProcess(req, res, next);
})

module.exports = router;