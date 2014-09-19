
var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
    _upper_case_eng_name()
}

function _a() {
    var checker = new Checker(".a {color: antiquewhite, antiquewhite, #a52a2a}")
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.a{color:#FAEBD7,#FAEBD7,brown}');
}

function _b() {
    var checker = new Checker(".test {\n\
          color: yellow;\n\
          border-color: #c0c0c0;\n\
          background: #ffffff;\n\
          border-top-color: #f00;\n\
          outline-color: rgb(0, 0, 0);\n\
      }")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.test{border-color:silver;border-top-color:red;background:#FFF;color:#FF0;outline-color:rgb(0,0,0)}');
}

function _upper_case_eng_name() {
    var checker = new Checker('a{color: black; font: black 60px fdUPPPER fdafdF Black , white ,sarif;}')
    checker.prepare();
    var res = checker.doCompress()
    equal(res, 'a{color:#000;font:#000 60px fdUPPPER fdafdF Black,#FFF,sarif}');
}