var Checker = require('./helper').Checker

exports.doTest = function() {
    _border_radius()
    _b()
    _c()
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

function _b() {
    var checker = new Checker('.foo4 {\
      border-top-left-radius: 10px 3em;\
      border-top-right-radius: 20px;\
      border-bottom-right-radius: 10px;\
      border-bottom-left-radius: 20px;\
    }')


    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.foo4{border-radius:10px 20px/3em 20px 10px}')
}

function _c() {
    var checker = new Checker('.foo4 {\
        border-top-left-radius: 2em 0.5em;\
        border-top-right-radius: 1em 3em;\
        border-bottom-right-radius: 4em 0.5em;\
        border-bottom-left-radius: 1em 3em;\
    ')

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.foo4{border-radius:2em 1em 4em/.5em 3em}')
}

