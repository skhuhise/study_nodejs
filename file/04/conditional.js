var args = process.argv;
var slice = args.slice(2);

console.log(args);
console.log(slice);

console.log('A');
console.log('B');

if(args[2] === '1') {
    console.log('C1');
} else {
    console.log('C2');
}

console.log('D');