var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
}

function _a() {
    var checker = new Checker('.bg {\
        background-color: #fff;\
        background-image: url(a.png);\
        background-repeat: repeat-x;\
        background-attachment: scroll;\
        background-position-x: left;\
        background-position-y: top;\
    }')

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.bg{background:#FFF url(a.png) repeat-x left top}');
}