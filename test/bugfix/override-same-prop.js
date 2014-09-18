var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
}

function _a() {
    var checker = new Checker(" .test {\n\
          color: red;\n\
          margin: 0;\n\
          line-height: 3cm;\n\
          color: green;\n\
      }")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.test{margin:0;line-height:3cm;color:green}')
}