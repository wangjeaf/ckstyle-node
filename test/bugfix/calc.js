var Checker = require('./helper').Checker

exports.doTest = function() {
    var checker = new Checker(".a{width: calc(1+2/3-3) calc(1+2); }")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.a{width:calc(1 + 2/3 - 3) calc(1 + 2)}', 'calc space ok');
}
