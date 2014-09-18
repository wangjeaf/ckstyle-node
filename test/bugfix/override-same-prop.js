var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
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

function _b() {
    var checker = new Checker(" .test {\n\
          color: red !important;\n\
          margin: 0;\n\
          line-height: 3cm;\n\
          color: green;\n\
      }")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.test{margin:0;line-height:3cm;color:red !important;color:green}')
}