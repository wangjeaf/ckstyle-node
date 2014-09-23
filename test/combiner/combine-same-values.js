
var Checker = require('./helper').Checker
var config = require('./helper').config

exports.doTest = function() {
    _a()
    _b()
    _c()
}

function _a() {
  var checker = new Checker(".test0 {padding: 0 } \n\
    .test1 {color: red } \n\
    .test2 {color: red } \n\
    .test3 {padding: 0 }", config)

  checker.prepare();
  var res = checker.doCompress()
  equal(res, '.test0,.test3{padding:0}.test1,.test2{color:red}'); 
}

function _b() {
  config.safe = true
  var checker = new Checker(".test0 {padding: 0 } \n\
    .test1 {color: red } \n\
    .test2 {color: red } \n\
    .test3 {padding: 0 }", config)

  checker.prepare();
  var res = checker.doCompress()
  equal(res, '.test0{padding:0}.test1,.test2{color:red}.test3{padding:0}'); 
  config.safe = false
}

function _c() {
  var checker = new Checker(".test0 {\
          margin-top: 1em;\
          margin-right: 2em;\
          margin-bottom: 3em;\
          margin-left: 4em;\
      }\
\
      .test1 {\
          margin: 1 2 3 2\
      }\
\
      .test2 {\
          margin: 1 2 1 2\
      }\
\
      .test3 {\
          margin: 1 1 1 1\
      }\
\
      .test4 {\
          margin: 1 1 1\
      }\
\
      .test5 {\
          margin: 1 1\
      }")

  checker.prepare();
  var res = checker.doCompress()
  equal(res, '.test0{margin:1em 2em 3em 4em}.test1{margin:1 2 3}.test2{margin:1 2}.test3,.test4,.test5{margin:1}');
}


