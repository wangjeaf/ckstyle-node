var doFix = require('./helper').doFix;

exports.doTest = function() {
    _combine_should_not_make_mistake()
    _totally_same_ruleset()
    do_not_touch_background_position()
    _do_not_change_comment()
}

function _combine_should_not_make_mistake() {
    css = '.a {width:0px} \n\
.a, .b{width:1px}\n\
.b{width:0px}'

    expected = '.a,\n\
.b {\n\
    width: 0;\n\
}\n\
\n\
.a,\n\
.b {\n\
    width: 1px;\n\
}'
    // safe mode is not default mode.
    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg, expected, 'do not make mistake when combine rulesets');
}

function do_not_touch_background_position() {
    css = '.a {background-position: 0 0} \n\
.test {width:1}\n\
.b {background-position: 0 0} '

    expected = '.a {\n\
    background-position: 0 0;\n\
}\n\
\n\
.test {\n\
    width: 1;\n\
}\n\
\n\
.b {\n\
    background-position: 0 0;\n\
}'
    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg, expected, 'do not combine background-position');
}

function _totally_same_ruleset() {
    css = '/*fdafda*/\n\
.page-title {\n\
   width: 100px;\n\
   padding: 0px 1px;\n\
}\n\
\n\
.page-title {\n\
   width: 100px;\n\
   padding: 0px 1px;\n\
}'

    expected = '/* fdafda */\n\
.page-title {\n\
    width: 100px;\n\
    padding: 0 1px;\n\
}'
    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg, expected, 'it is the same ruleset');
}

function _do_not_change_comment() {
    css = '/*fdafda, fda,fda,fdas\n\
    */\n\
.page-title {\n\
   width: 100px;\n\
   padding: 0px 1px;\n\
}\n\
\n\
.page-title {\n\
   width: 100px;\n\
   padding: 0px 1px;\n\
}'

    expected = '/*fdafda, fda,fda,fdas\n\
    */\n\
.page-title {\n\
    width: 100px;\n\
    padding: 0 1px;\n\
}'
    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg, expected, 'do not change comment is ok');
}