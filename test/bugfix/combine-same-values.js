
var Checker = require('./helper').Checker
var config = require('./helper').config

exports.doTest = function() {
    _a()
    _b()
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
  equal(res, '.test0{padding:0}.test1{color:red}.test2{color:red}.test3{padding:0}'); 
  config.safe = false
}