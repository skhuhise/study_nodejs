const express = require('express');
const router = express.Router();
var author = require('../lib/author');
const { check, validationResult } = require('express-validator/check');

router.get('/', (req, res, next) => {
    author.home(req, res, next);
})

router.post('/create', [
    check('name').isLength( { max : 15, min : 1 } ),
    check('profile').exists()
] ,(req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect('/')
        return false;
    }
    author.createProcess(req, res, next);
})

router.get('/update/:id', (req, res, next) => {
    author.update(req, res, next);
})

router.post('/update', [
    check('name').isLength( { max : 15, min : 1 } ),
    check('profile').exists()
], (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect('/')
        return false;
    }
    author.updateProcess(req, res, next);
})

router.post('/delete', check('id').isNumeric(), (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect('/')
        return false;
    }
    author.deleteProcess(req, res, next);
})

module.exports = router;