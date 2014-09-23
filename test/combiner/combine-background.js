var Checker = require('./helper').Checker

exports.doTest = function() {
    // _a()
}

function _a() {
    var checker = new Checker('.demo {\
        animation-delay: .8s;\
        animation-direction: alternate;\
        animation-duration: 200ms;\
        animation-fill-mode: both;\
        animation-iteration-count: infinite;\
        animation-name: foo;\
        animation-play-state: paused;\
        animation-timing-function: ease;\
    }')

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.demo{animation:foo 200ms ease .8s infinite alternate paused both}');
}