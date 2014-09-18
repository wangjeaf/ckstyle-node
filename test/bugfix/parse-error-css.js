var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
}

function _a() {
    var checker = new Checker("@keyframes blink{0%{background-color:#fff}50%{background-color:#000}100%{background-color:#fff}")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '@keyframes blink{0%,100%{background-color:#FFF}50%{background-color:#000}}');
}