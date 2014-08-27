var doFix = require('./helper').doFix;

exports.doTest = function() {
    _with_comment()
    _without_comment()
}

function _with_comment() {
    css = '/**\n' + 
' * @descript: topic pages\n' + 
' * @author: ming.zhou\n' + 
' * @date: 2012-12-7\n' + 
' */\n' + 
'\n' + 
'@import url(dfafdas);\n' + 
'\n' + 
'@import url(dfafdas);'

    expectedFixed = '/**\n' + 
' * @descript: topic pages\n' + 
' * @author: ming.zhou\n' + 
' * @date: 2012-12-7\n' + 
' */\n' + 
'@import url(dfafdas);\n' + 
'\n' + 
'@import url(dfafdas);'

    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg.trim(), expectedFixed.trim(), 'extra statement with comment is ok')
}

function _without_comment() {
    css = '\n\
\n\
@import url(dfafdas);\n\
\n\
@import url(dfafdas);'

    expectedFixed = '@import url(dfafdas);\n\
\n\
@import url(dfafdas);\n\
'

    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg.trim(), expectedFixed.trim(), 'extra statement without comment is ok')
}
