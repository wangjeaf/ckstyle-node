var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
    _padding()
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

function _padding() {
    var checker = new Checker(".foo2 {\
  padding-top: 50%;\
  padding-right: .90em;\
  padding-bottom: 10px;\
  padding-left: .90em;\
}")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.foo2{padding:50% .9em 10px}');
}
