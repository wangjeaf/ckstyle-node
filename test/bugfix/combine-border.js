
var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
}

function _a() {
    var checker = new Checker(".foo3 {\
  border-width: 1px;\
  border-style: solid;\
  border-color: #333;\
  border-top-width: 2px;\
  border-top-style: solid;\
  border-top-color: blue;\
}\
")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.foo3{border:1px solid #333;border-top:2px solid blue}');
}
