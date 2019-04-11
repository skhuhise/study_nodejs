const express = require('express');
const app = express();

app.get('/', (req, res) => {
    return res.send('/');
});

app.get('/page', (req, res) => {
    return res.send('/page');
})

app.listen(3000, () => {
    console.log('example app listening on port 3000!');
})