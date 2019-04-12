const express = require('express');
const app = express();
var router1 = express.Router();
var router2 = express.Router();

var trueWare = (req, res, next) => {
    console.log('true');
    res.send('it is true ware');
}

var falseWare = (req, res, next) => {
    console.log('false');
    next();
}

var ifWare = (req, res, next) => {
    if(req.value != undefined)
        next();

    else
        next('route');
}

app.route('/true')
    .get((req, res, next) => {
        req.value = 1;
        next();
    }, (req, res, next) => {
        req.value = 2;
        console.log('value 값은', req.value);
        next();
    }, ifWare, trueWare)
    .get(falseWare);

router1.get('/false', ifWare, trueWare);
router1.get('/false', falseWare)
router2.get('/false/none', ifWare, trueWare);
router2.get('/false/none', falseWare)
app.use(router1);

app.get('/', (req, res) => res.send('Hello! World!'));
app.get('/true', (req, res) => res.send('it is false ware'));
app.get('/false', (req, res) => res.send('it is false ware'));
app.get('/false/none', (req, res) => res.send('it is false ware'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));