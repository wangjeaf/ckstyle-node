var doCssCompress = require('./helper').doCssCompress

exports.doTest = function() {
    _basic()
    _with_hack()
    _with_extra()
    _with_keyframes()
    _with_keyframes_enter()
    _only_comments()
    _with_complecated_keyframes()
}

function _basic() {
    msg = doCssCompress('/* @wangjeaf */ .test {width: 100px; height: 100px;}')
    equal(msg, '.test{width:100px;height:100px}', 'compressed')
}

function _with_hack() {
    msg = doCssCompress('.test {_width: 100px; *height: 100px;}')
    equal(msg, '.test{_width:100px;*height:100px}', 'hack compressed')
}

function _with_extra() {
    msg = doCssCompress('@import (url-here);.test {_width: 100px; *height: 100px;}')
    equal(msg, '@import (url-here);.test{_width:100px;*height:100px}', 'extra compressed')
}

function _with_keyframes() {
    msg = doCssCompress('@keyframes "test"{ \n10% {\nwidth:100px;\n} 60% {\nwidth: 200px;\n}}')
    equal(msg, '@keyframes \'test\'{10%{width:100px}60%{width:200px}}', 'keyframes compressed')
}

function _with_keyframes_enter() {
    msg = doCssCompress("\n\
@keyframes .fdasfads {\n\
    10% {\n\
        width: 200px;\n\
    }\n\
\n\
    20% {\n\
        width: 200px;\n\
    }\n\
}")
    equal(msg, '@keyframes .fdasfads{10%{width:200px}20%{width:200px}}', 'keyframes compressed')
}

function _only_comments() {
    msg = doCssCompress('/* a */ /* a */ /* a */ /* a */')
    equal(msg, '', 'nothing')
}

function _with_complecated_keyframes() {
    msg = doCssCompress('@keyframes "test"{ \n10% {\nwidth:100px;\n} 60% {\nwidth: 200px;\n}}')
    equal(msg, '@keyframes \'test\'{10%{width:100px}60%{width:200px}}', 'keyframes compressed')
}

function _with_keyframes_enter() {
    msg = doCssCompress("@media screen and (-webkit-min-device-pixel-ratio:0) {\n\
 .publisher-c .global-publisher-selector{ top:5px;}\n\
 .publisher-a .global-publisher-selector-status a,\n\
 .publisher-a .global-publisher-selector-status .global-publisher-status-trigger:hover,\n\
 .publisher-a .global-publisher-selector .active .global-publisher-status-trigger {\n\
    background-position: 0 1px;\n\
}\n\
 .publisher-a .global-publisher-selector-share a,\n\
 .publisher-a .global-publisher-selector-share a:hover,\n\
 .publisher-a .global-publisher-selector .active .global-publisher-share-trigger{\n\
    background-position: 0 -48px;\n\
 }\n\
}")
    equal(msg, '@media screen and (-webkit-min-device-pixel-ratio:0){.publisher-c .global-publisher-selector{top:5px}.publisher-a .global-publisher-selector-status a,.publisher-a .global-publisher-selector-status .global-publisher-status-trigger:hover,.publisher-a .global-publisher-selector .active .global-publisher-status-trigger{background-position:0 1px}.publisher-a .global-publisher-selector-share a,.publisher-a .global-publisher-selector-share a:hover,.publisher-a .global-publisher-selector .active .global-publisher-share-trigger{background-position:0 -48px}}', 'complecated keyframes compressed')
}
