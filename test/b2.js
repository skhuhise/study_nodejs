console.log('b2.js 시작');

const a2 = require('./a2');

exports.call = () => {
    console.log('b2.js의 call에서의 a2: ', a2);
};