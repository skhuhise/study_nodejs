const express = require('express');
const router = express.Router();
var author = require('../lib/author');
const { check, validationResult } = require('express-validator/check');

router.get('/', (req, res, next) => {
    author.home(req, res, next);
})

router.post('/create', [
    check('name').exists(),
    check('profile').exists()
] ,(req, res, next) => {
    author.createProcess(req, res, next);
})

router.get('/update/:id', (req, res, next) => {
    author.update(req, res, next);
})

router.post('/update', (req, res, next) => {
    author.updateProcess(req, res, next);
})

router.post('/delete', (req, res, next) => {
    author.deleteProcess(req, res, next);
})

module.exports = router;