var Checker = require('../../ckstyle/ckstyler').CssChecker;

exports.doFormat = function(css) {
    var checker = new Checker(css);
    checker.prepare();
    return checker.doFormat();
}