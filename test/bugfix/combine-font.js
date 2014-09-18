var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
    _c()
}

function _a() {
    var checker = new Checker(".f{border-color:red}")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.f{border-color:red}');
}

function _b() {
    var checker = new Checker(".f{border-color:red; border-style: dashed}")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.f{border:medium dashed red}');
}


function _c() {
    var checker = new Checker(".f{border:2px;border-width:1px}")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.f{border:1px}');
}