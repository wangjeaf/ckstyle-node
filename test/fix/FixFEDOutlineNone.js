var doFix = require('./helper').doFix;

exports.doTest = function() {
    _try()
}

function _try() {
    var msg = doFix('.test {outline:none;}', '')[1]
    equal(msg, '.test {\n\
    outline: 0;\n\
}', 'outline fix ok')
}
