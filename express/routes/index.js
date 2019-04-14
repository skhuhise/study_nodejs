const express = require('express');
const router = express.Router();
var topic = require('../lib/topic');

router.get('/', (req, res, next) => {
    topic.home(req, res, next);
})

module.exports = router;