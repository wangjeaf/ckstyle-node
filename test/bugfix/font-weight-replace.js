var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
}

function _a() {
    var checker = new Checker(".test0 {\n\
          font-weight: bold\n\
      }\n\
\n\
      .test1 {\n\
          font-weight: normal\n\
      }")


    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.test0{font-weight:700}.test1{font-weight:400}');
}