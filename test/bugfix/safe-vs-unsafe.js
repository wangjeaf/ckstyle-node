var Checker = require('./helper').Checker

exports.doTest = function() {
    _same_rulesets_safe()
    _same_rulesets_unsafe()
}

function _same_rulesets_safe() {
    var checker = new Checker('.a {width:0} .a, .b{width:0}, .b{width:0}, c{width:1}, d{width:0},e {width: 0}', {safe: true})

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.a,.b{width:0},c{width:1},d,e{width:0}');
}

function _same_rulesets_unsafe() {
    var checker = new Checker('.a {width:0} .a, .b{width:0}, .b{width:0}, c{width:1}, d{width:0},e {width: 0}', {safe: false})

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.a,.b,d,e{width:0},c{width:1}');
}
function _same_selector_safe() {
    var checker = new Checker('.a {width:0} .b{height:0}, .a{height:1}, .b{width:1}', {safe: true})
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.a{width:0}.b{height:0},.a{height:1},.b{width:1}');
}

function _same_selector_unsafe() {
    var checker = new Checker('.a {width:0} .b{height:0}, .a{height:1}, .b{width:1}', {safe: false})
    checker.prepare();
    var res = checker.doCompress()
    equal(res, '.a{width:0;height:1}.b{height:0;width:1}');
}
