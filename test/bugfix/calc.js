var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
}

function _a() {
    var checker = new Checker(".a{width: calc(1+2/3-3) calc(1+2); }")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.a{width:calc(1 + 2/3 - 3) calc(1 + 2)}', 'calc space ok');
}

function _b() {
    var checker = new Checker('.test1{margin:calc(1rem - 2px) calc(1rem + 10px)}', {safe: false})

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.test1{margin:calc(1rem - 2px) calc(1rem + 10px)}'); //.test{margin:0;line-height:3cm;color:green}
}

