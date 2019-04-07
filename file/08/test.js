var fs = require('fs');

console.log('A');
var result = fs.readFileSync('test.txt', 'utf8');
console.log(result + ' readFileSync');
console.log('C');

console.log('A');
fs.readFile('test.txt', 'utf8', (err, result) => {
    console.log(result + ' redFile');
});

console.log('C');

function a1() {
    console.log('J');
}

var a = () => {
    console.log('K');
}

function slowFunc(callback){
    console.log("kasd");
    callback();
    console.log("!!");
}

a1();
slowFunc(a);
a1();


var test = (word) => {
    console.log(word);
}

function testFunc(word, callback) {
    callback(word);
}

function testFunc2(callback) {
    callback();
}

testFunc('not bad', test);

var te = 'tap'

testFunc(te, (go) => {
    console.log(te);
})

testFunc2((tt, qq) => {
    tt = 'asdfsadf';
    qq = 'zcxvzxcv';
    console.log(tt);
    console.log(qq);
})

var testing1 = (a, b, callback) => {
    callback(a, b);
}

testing1(10, 5, (res1, res2) => {
    console.log(res1);
    console.log(res2);
});