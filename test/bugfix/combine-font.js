var Checker = require('./helper').Checker

exports.doTest = function() {
    _a()
    _b()
    _c()
}


function _a() {
    var checker = new Checker('.foo5 {\
        line-height: 1.6;\
        font-style: italic;\
        font-variant: small-caps;\
        font-weight: 700;\
        font-size: 12px;\
        font-family: arial,"Lucida Grande",sans-serif;\
    }\
    ')

    checker.prepare();
    var res = checker.doCompress()
    equal(res, ".foo5{font:italic small-caps 700 12px/1.6 arial,Lucida Grande,sans-serif}");
}

function _b() {
    var checker = new Checker('.foo5 {\
        line-height: 1.6;\
        font-style: italic;\
        font-variant: small-caps;\
        font-weight: 700;\
        font-size: 12px;\
        font-style: normal;\
        font-family: arial,"Lucida Grande",sans-serif;\
    }\
    ')

    checker.prepare();
    var res = checker.doCompress()
    equal(res, ".foo5{font:normal small-caps 700 12px/1.6 arial,Lucida Grande,sans-serif}");
}

function _c() {
    var checker = new Checker('\
    .test2 {\
        font-family: "tahoma", "arial", "Microsoft Yahei";\
    }\
    }')

    checker.prepare();
    var res = checker.doCompress()
    equal(res, ".test2{font-family:tahoma,arial,Microsoft Yahei}");
}
