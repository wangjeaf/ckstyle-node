var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
}

function _a() {
    var checker = new Checker(".test {\
          color: red\
      }\
      .empty {}\
      @font-face {}\
      @media print {\
          .empty {}\
      }\
      .test {\
          border: none\
      }")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.test{color:red;border:none}');
}

function _b() {
}