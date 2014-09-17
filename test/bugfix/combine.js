var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
}

function _a() {
    var checker = new Checker(".test1 {\n\
        margin: 10px !important;\n\
        margin-top: 20px;\n\
    }")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.test1{margin:10px !important;margin-top:20px}')
}

function _b() {
    var checker = new Checker(".foo2 {\n\
      margin: 10px 20px 9em 20px;\n\
    }")


    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.foo2{margin:10px 20px 9em}');
}