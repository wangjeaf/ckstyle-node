var doFix = require('./helper').doFix;

exports.doTest = function() {
    _handle_nested_statement()
    _handle_nested_statement_qipa()
}

function _handle_nested_statement() {
    css = "@media screen and (-webkit-min-device-pixel-ratio:0) {\n\
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
}"

    expectedFixed = "@media screen and (-webkit-min-device-pixel-ratio:0) {\n\
    .publisher-c .global-publisher-selector {\n\
        top: 5px;\n\
    }\n\
    \n\
    .publisher-a .global-publisher-selector-status a,\n\
    .publisher-a .global-publisher-selector-status .global-publisher-status-trigger:hover,\n\
    .publisher-a .global-publisher-selector .active .global-publisher-status-trigger {\n\
        background-position: 0 1px;\n\
    }\n\
    \n\
    .publisher-a .global-publisher-selector-share a,\n\
    .publisher-a .global-publisher-selector-share a:hover,\n\
    .publisher-a .global-publisher-selector .active .global-publisher-share-trigger {\n\
        background-position: 0 -48px;\n\
    }\n\
}"

    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg.trim(), expectedFixed.trim(), 'nested statement is ok')
}

function _handle_nested_statement_qipa() {
    var css = "@-moz-keyframes hinge {\n\
    0% { -moz-transform: rotate(0); -o-transform: rotate(0); -moz-transform-origin: top left; -moz-animation-timing-function: ease-in-out; } \n\
    20%, 60% { -moz-transform: rotate(80deg); -moz-transform-origin: top left; -moz-animation-timing-function: ease-in-out; }   \n\
    40% { -moz-transform: rotate(60deg); -moz-transform-origin: top left; -moz-animation-timing-function: ease-in-out; }    \n\
    80% { -moz-transform: rotate(60deg) translateY(0); opacity: 1; -moz-transform-origin: top left; -moz-animation-timing-function: ease-in-out; } \n\
    100% { -moz-transform: translateY(700px); opacity: 0; }\n\
}"

    var expectedFixed = "@-moz-keyframes hinge {\n\
    0% {\n\
        -moz-animation-timing-function: ease-in-out;\n\
           -moz-transform: rotate(0);\n\
             -o-transform: rotate(0);\n\
        -moz-transform-origin: top left;\n\
    }\n\
    \n\
    20%,\n\
    60% {\n\
        -moz-animation-timing-function: ease-in-out;\n\
        -moz-transform: rotate(80deg);\n\
        -moz-transform-origin: top left;\n\
    }\n\
    \n\
    40% {\n\
        -moz-animation-timing-function: ease-in-out;\n\
        -moz-transform: rotate(60deg);\n\
        -moz-transform-origin: top left;\n\
    }\n\
    \n\
    80% {\n\
        -moz-animation-timing-function: ease-in-out;\n\
        -moz-transform: rotate(60deg) translateY(0);\n\
        -moz-transform-origin: top left;\n\
        opacity: 1;\n\
    }\n\
    \n\
    100% {\n\
        -moz-transform: translateY(700px);\n\
        opacity: 0;\n\
    }\n\
}"

    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg.trim(), expectedFixed.trim(), 'qipa nested statement is ok')
}
    