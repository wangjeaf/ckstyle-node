var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
}

function _a() {

    var checker = new Checker(".f{\
        list-style-image: url(../image.gif);\
        list-style-position: inside;\
        list-style-type: square;\
    }")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.f{list-style:square inside url(../image.gif)}');
}

function _b() {
    var checker = new Checker(".f{\
        list-style-position: inside;\
        list-style-type: square;\
    }")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.f{list-style:square inside}');
}