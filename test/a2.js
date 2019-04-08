console.log('a2.js 시작');

const b2 = require('./b2');

exports.call = () => {
    console.log('a2.js의 call에서의 b2: ', b2);
};