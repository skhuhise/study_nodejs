var fs = require('fs');
//const fs

fs.readFile('sample.txt', (err, data) => {
    if(err) throw err;
    console.log(data);
});

fs.readFile('sample.txt', 'utf8', (err, data) => {
    if(err) throw err;
    console.log(data);
});