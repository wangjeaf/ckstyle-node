var doFix = require('./helper').doFix;

var getDefaultConfig = require('./helper').getDefaultConfig
var defaultConfig = getDefaultConfig()

exports.doTest = function() {
    _singleLine()
    _multiLine()
}

function _singleLine() {
    defaultConfig.singleLine = true
    var result = doFix('.test {width:"100px";color:#DDDDDD;} .test2 {width:"100px";color:#DDDDDD;}', '', defaultConfig)
    var fixer = result[0]
    var msg = result[1]
    defaultConfig.singleLine = false
    equal(msg, ".test,\n\
.test2 { width: '100px'; color: #DDD; }", 'fix to single line is ok')
}

function _multiLine() {
    var result = doFix('.test {width:"100px";color:#DDDDDD;} .test2 {width:"100px";color:#DDDDDD;}', '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg, ".test,\n\
.test2 {\n\
    width: '100px';\n\
    color: #DDD;\n\
}", 'fix to multi line is ok')
}