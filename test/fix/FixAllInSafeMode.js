var doFix = require('./helper').doFix;
var getDefaultConfig = require('./helper').getDefaultConfig
var defaultConfig = getDefaultConfig()

exports.doTest = function() {
    _singleLine()
    _multiLine()
}

function _singleLine() {
    defaultConfig.safe = true
    var result = doFix('.test {width:"100px";color:#DDDDDD;margin:0 auto 0 auto;} .test2 {width:"100px";color:#DDDDDD;margin-top:0;margin-left:auto;margin-right:auto;margin-bottom:0;}', '', defaultConfig)
    var fixer = result[0]
    var msg = result[1]
    defaultConfig.safe = false
    equal(msg, 
".test,\n\
.test2 {\n\
    width: '100px';\n\
    margin: 0 auto;\n\
    color: #DDD;\n\
}", 'safe mode true, fix is ok')
}

function _multiLine() {
    var result = doFix('.test {width:"100px";color:#DDDDDD;margin:0 auto 0 auto;} .test2 {width:"100px";color:#DDDDDD;margin-top:0;margin-left:auto;margin-right:auto;margin-bottom:0;}', '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg, 
".test,\n\
.test2 {\n\
    width: '100px';\n\
    margin: 0 auto;\n\
    color: #DDD;\n\
}", 'default safe is false, fix is ok')
}
