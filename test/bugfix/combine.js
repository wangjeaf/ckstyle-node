var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
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