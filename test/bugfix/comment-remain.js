var Checker = require('./helper').Checker

exports.doTest = function() {
    var checker = new Checker("/* !fda */.a { width: 1;}")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '/*!fda*/.a{width:1}', 'ok');
}
