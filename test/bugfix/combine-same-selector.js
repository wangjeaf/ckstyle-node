
var Checker = require('./helper').Checker
var config = require('./helper').config

exports.doTest = function() {
    _a()
    _b()
}

function _a() {
  var checker = new Checker(".test0 {margin: 0 } \n\
    .test1 {border: none } \n\
    .test1 {background-color: green } \n\
    .test1 {color: red } \n\
    .test0 {padding: 0 }", config)

  checker.prepare();
  var res = checker.doCompress()
  equal(res, '.test0{margin:0;padding:0}.test1{border:none;background-color:green;color:red}'); 
}

function _b() {
  config.safe = true
  var checker = new Checker(".test0 {margin: 0 } \n\
    .test1 {border: none } \n\
    .test1 {background-color: green } \n\
    .test1 {color: red } \n\
    .test0 {padding: 0 }", config)

  checker.prepare();
  var res = checker.doCompress()
  equal(res, '.test0{margin:0}.test1{border:none;background-color:green;color:red}.test0{padding:0}'); 
  config.safe = false
}