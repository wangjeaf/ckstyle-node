
var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
    _c()
}

function _a() {
    var checker = new Checker(".transition {\
      transition-property: padding;\
      transition-duration: .33s;\
      transition-timing-function: ease;\
      transition-duration: .36s;\
      transition-delay: -1s;\
    }\
    ")


    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.transition{transition:padding .36s ease -1s}');
}

function _b() {
    var checker = new Checker(".transition {\
      -webkit-transition-property: padding;\
      -webkit-transition-duration: .36s;\
      -webkit-transition-timing-function: ease;\
      -webkit-transition-delay: -1s;\
    }\
    ")


    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.transition{-webkit-transition:padding .36s ease -1s}');
}

function _c() {
    var checker = new Checker(".transition {\
      -o-transition: 1s;\
      -o-transition-property: padding;\
      -o-transition-duration: .36s;\
      -o-transition-timing-function: ease;\
      -o-transition-delay: -1s;\
    }\
    ")


    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.transition{-o-transition:padding .36s ease -1s}');
}