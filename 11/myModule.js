var myModuleTest = {
    test:'test',
    func:function() {
        console.log(this.test);
    }
}

var test2 = {
    testy:'non',
    funcy:function() {
        console.log(this.testy);
    }
}

module.exports = myModuleTest;
module.exports = test2;
//아래 모듈만 적용.