var Checker = require('./helper').Checker

exports.doTest = function() {
    _no_hack()
    _has_hack()
}


function _no_hack() {
    var checker = new Checker('\
    .test2 {\
        *display: none;\
        width: 100px;\
        border: 1px solid #FFF;\
        height: 200px;\
        _display: inline-block;\
        margin: 20px 10px 10px;\
    }\
    \
    .test3 {\
        margin: 0 10px 20px;\
        border: 1px solid #fff;\
        width: 100px;\
        height: 200px;\
        *display: none;\
        _display: inline-block;\
        margin-top: 20px;\
        margin-left: 10px;\
        margin-right: 10px;\
        margin-bottom: 1px;\
        margin-bottom: 10px;\
    }')

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.test2,.test3{*display:none;_display:inline-block;width:100px;height:200px;margin:20px 10px 10px;border:1px solid #FFF}');
}

function _has_hack() {
    var checker = new Checker('\
    .test2 {\
        *display: none;\
        width: 100px;\
        border: 1px solid #FFF;\
        height: 200px;\
        _display: inline-block;\
        margin: 20px 10px 10px;\
    }\
    \
    .test3 {\
        margin: 0 10px 20px;\
        border: 1px solid #fff;\
        width: 100px;\
        height: 200px;\
        *display: none;\
        _display: inline-block;\
        margin-top: 20px;\
        margin-left: 10px;\
        margin-right: 10px;\
        _margin-bottom: 1px;\
        margin-bottom: 10px;\
    }')

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.test2{*display:none;_display:inline-block;width:100px;height:200px;margin:20px 10px 10px;border:1px solid #FFF}.test3{*display:none;_display:inline-block;width:100px;height:200px;margin:20px 10px;_margin-bottom:1px;margin-bottom:10px;border:1px solid #FFF}')
}