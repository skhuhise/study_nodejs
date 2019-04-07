var a = 1;
console.log(a);
a = 2;
console.log(a);

var name = 'k8805';
var letter = 'dear ' + name + '\n\n\
testing ' + name + ' good ' + name;

console.log(letter);

var letter = `dear ${name}

testing ${name} good ${name}
${1+1}`;

console.log(letter);