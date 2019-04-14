const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    res.status(404).send();
})

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send();
})

module.exports = router;