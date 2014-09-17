
var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
}

function _a() {
    var checker = new Checker(".a {color: antiquewhite, antiquewhite, #a52a2a}")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.a{color:#faebd7,#faebd7,brown}');
}

