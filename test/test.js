const a = require('./a');
console.log('a require')
const b = require('./b');
console.log('b require');

a.call();
console.log('a call')
b.call();
console.log('b call')

console.log('------------------------------')

const a2 = require('./a2');
console.log('a2 require')
const b2 = require('./b2');
console.log('b2 require');

a2.call();
console.log('a2 call')
b2.call();
console.log('b2 call')

