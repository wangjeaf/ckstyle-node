var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
}

function _a() {
    var checker = new Checker("/* !fda */.a { width: 1;}")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '/*!fda*/.a{width:1}', 'ok');
}

function _b() {
    var checker = new Checker("/*! MIT license */\n\
      /*! will be removed */\n\
\n\
      .test {\n\
          color: red\n\
      }")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '/*! MIT license*/.test{color:red}');
}