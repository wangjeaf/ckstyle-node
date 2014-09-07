var helper = require('./helper')

exports.doTest = function() {
    _simple()
    _nocombine()
}


function _simple() {
    var css = '.a {width: 100px; height: 200px;}'
    var expectedFormatted = '.a {\n\
    width: 100px;\n\
    height: 200px;\n\
}'
    var res = helper.doFormat(css);
    equal(res.trim(), expectedFormatted.trim(), 'simple format is ok')
}

function _nocombine() {
    var css = '.a {width: 100px;} .b{width: 100px}'
    var expectedFormatted = '.a {\n\
    width: 100px;\n\
}\n\
\n\
.b {\n\
    width: 100px;\n\
}'
    var res = helper.doFormat(css);
    equal(res.trim(), expectedFormatted.trim(), 'no combine when format is ok')
}