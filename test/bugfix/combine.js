var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
    _border_radius()
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

function _border_radius() {
    var checker = new Checker(".a {\
        border-radius: 5px;\
        border-top-left-radius: 4px;\
        border-top-right-radius: 3px;\
        border-bottom-right-radius: 3px;\
        border-bottom-left-radius: 0px;\
        border-bottom-left-radius: 7px;\
        border-radius: 5px;\
        border-bottom-right-radius: 7px;\
    }")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.a{border-radius:5px 5px 7px}');
}