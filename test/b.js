console.log('b.js 시작');

const a = require('./a');

module.exports = {
    call: () => {
        console.log('b.js의 call에서의 a: ', a);
    }
};