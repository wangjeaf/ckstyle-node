var doFix = require('./helper').doFix;

exports.doTest = function() {
    var result = doFix('.test {-webkit-border-radius: 3px;-moz-border-radius:3px;border-radius:3px;}', '')
    msg = result[1]
    equal(msg, '.test {\n    -webkit-border-radius: 3px;\n       -moz-border-radius: 3px;\n            border-radius: 3px;\n}', 'ok')

    var result = doFix('.test {border-radius:3px;}', '')
    var msg = result[1]
    equal(msg, '.test {\n    border-radius: 3px;\n}', 'ok')
}