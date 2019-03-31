console.log('A');
console.log('B');
console.log('C1');
console.log('C2');
console.log('C1');
console.log('C2');
console.log('D');

var i = 0;

console.log('A');
console.log('B');

while(i < 2) {
    console.log('C1');
    console.log('C2');
    i = i + 1;
}

console.log('D');

console.log('A');
console.log('B');

for(var j = 0; j < 2; ++j) {
    console.log('C1');
    console.log('C2');
}

console.log('D');

console.log('A');
console.log('B');

i = 0;
while(i < 2) {
    console.log('C1');
    console.log('C2');
    ++i;
}

console.log('D');

