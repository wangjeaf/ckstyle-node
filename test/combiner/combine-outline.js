var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
    _c()
}

function _a() {
    var checker = new Checker(".f{outline-color:red}")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.f{outline-color:red}');
}

function _b() {
    var checker = new Checker(".f{outline-color:red; outline-style: dashed}")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.f{outline:invert dashed red}');
}


function _c() {
    var checker = new Checker(".f{outline:2px;outline-width:1px}")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.f{outline:1px}');
}