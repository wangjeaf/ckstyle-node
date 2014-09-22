var Checker = require('./helper').Checker

exports.doTest = function() {
    var checker = new Checker(".a {color: antiquewhite, antiquewhite, #a52a2a}", {})

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.a{color:#FAEBD7,#FAEBD7,brown}');

    equal(checker.config.errorLevel, 2, 'errorLevel inited')
    equal(checker.config.recursive, false, 'recursive inited')
}