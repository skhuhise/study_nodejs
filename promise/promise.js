function process(data) {
    return new Promise((resolve, reject) => {
        if(data)
            resolve(100)
        else
            reject(new Error('200'))
    })
}

function test() {
    return new Promise((resolve, reject) => {
        console.log('test function');
        resolve(200)
    })
}

process(true).then(result => {
    console.log('1', result);
})

process(true).then(result => {
    console.log('2', result);
}).catch(err => {
    console.log(err);
})

process(true).then(result => {
    console.log('3', result);
    return result + 20;
}).then(result => {
    console.log('4', result);
    return result + 20;
}).then(result => {
    console.log('5', result);
}).catch(err => {
    console.log(err);
})

process(true)
.then(result => {
    console.log('6', result)
    return test();
})
.then(result => {
    console.log('7', result)
})
.then(test)
.then(result => {
    console.log('8', result)
})

function async1 (data) {
    return new Promise((resolve, reject) => {
        resolve(data + 10)
    })
}

function async2 (data) {
    return new Promise((resolve, reject) => {
        resolve(data + 100)
    })
}

function async3 (data) {
    return new Promise((resolve, reject) => {
        resolve(data + 1000)
    })
}

function display(data) {
    return new Promise((resolve, reject) => {
        resolve(console.log('my data:', data))
    })
}

async1(1)
.then(async2)
.then(async3)
.then(display)