var arr = ['fine', 'bad', 'kim'];

console.log(arr);
console.log(arr[1]);

var obj = {
    'friend': 'fine',
    'rival' : 'bad',
    'wife' : 'kim'
};

console.log(obj);
console.log(obj.rival);
console.log(obj['rival']);

for(var i = 0; i < arr.length; ++i)
    console.log(`array ${i}`, arr[i]);

for(var i in obj) {
    console.log('obj', 'key:', i, 'value:', obj[i]);
}

var f1 = () => {
    console.log(1 + 1);
    console.log(1 + 2);
}

console.log(f1);
f1();

var f2 = (value) => {
    console.log(value);
}

console.log(f2);
f2(20);

var a = [f1, f2];

console.log(a);
console.log(a[0]);

a[0]();
a[1](15);

var o = {
    f3:f1,
    f4:f2
}

console.log(o);
console.log(o.f3);
console.log(o['f3']);

o.f3();
o.f4(10);

var q = {
    v1:'v1',
    v2:'v2',
    k1:function() {
        console.log(q.v1);
        console.log(this.v1);
    },
    k2:function(value) {
        console.log(q.v2, value);
        console.log(this.v2);
    },
    k3:() => {
        console.log(this.v1);
        console.log(q.v1);
    }
}

console.log(q);
console.log(q.v1);
console.log(q.v2);
console.log(q.k1);
console.log(q.k2);
console.log(q.k3);

q.k1();
q.k2(20);
q.k3();


// var f = function a() {} != var f = () => {}
// 전자는 함수 표현식, 후자는 익명 함수. 익명함수는 새로운 객체안에 함수이기 때문에 this가 새로운 객체이지만 함수 표현식의 this는 자신이 속한 객체를 의미한다.

// var f = function a() {} == function a() {} == obj { a:function() {} }
// var f = function() {} == var f = () => {} == obj { a:() => {} }