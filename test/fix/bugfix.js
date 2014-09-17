var doFix = require('./helper').doFix;

exports.doTest = function() {
    var result = doFix('.test {transition: 0ms; animation: 0s}', '')
    fixer = result[0];
    msg = result[1];

    equal(msg, '.test {\n    animation: 0s;\n    transition: 0ms;\n}', '0ms/0s is ok')
}