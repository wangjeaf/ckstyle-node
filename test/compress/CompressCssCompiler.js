var doCssCompress = require('./helper').doCssCompress

exports.doTest = function() {
    _no_space()
    _has_space()
    _just_prefix()
}

function _no_space() {
    msg = doCssCompress('@-css-compiler{selector-compile:no-combinator;rule-compile:all}html{width:100px;}')
    equal(msg, 'html{width:100px}', '@css-compiler compressed')
}

function _has_space() {
    msg = doCssCompress('@-css-compiler   {selector-compile:no-combinator;rule-compile:all}html{width:100px;}')
    equal(msg, 'html{width:100px}', '@css-compiler compressed')
}

function _just_prefix() {
    msg = doCssCompress('@-css-compiler-prefix fdsafdsafdsa;html{width:100px;}')
    equal(msg, 'html{width:100px}', '@css-compiler compressed')
}

if (!module.parent) {
    exports.doTest();
}