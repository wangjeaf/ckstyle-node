var doFix = require('./helper').doFix;

exports.doTest = function() {
    _handle_complicated_statement()
}

function _handle_complicated_statement() {
    css = '.ui-bar-a {\n\
    border: 1px solid       #333 /*{a-bar-border}*/;\n\
    background:             #111 /*{a-bar-background-color}*/;\n\
    color:                  #fff /*{a-bar-color}*/;\n\
    font-weight: bold;\n\
    text-shadow: 0 /*{a-bar-shadow-x}*/ -1px /*{a-bar-shadow-y}*/ 1px /*{a-bar-shadow-radius}*/ #000 /*{a-bar-shadow-color}*/;\n\
    background-image: -webkit-gradient(linear, left top, left bottom, from( #3c3c3c /*{a-bar-background-start}*/), to( #111 /*{a-bar-background-end}*/)); /* Saf4+, Chrome */\n\
    background-image: -webkit-linear-gradient( #3c3c3c /*{a-bar-background-start}*/, #111 /*{a-bar-background-end}*/); /* Chrome 10+, Saf5.1+ */\n\
    background-image:    -moz-linear-gradient( #3c3c3c /*{a-bar-background-start}*/, #111 /*{a-bar-background-end}*/); /* FF3.6 */\n\
    background-image:     -ms-linear-gradient( #3c3c3c /*{a-bar-background-start}*/, #111 /*{a-bar-background-end}*/); /* IE10 */\n\
    background-image:      -o-linear-gradient( #3c3c3c /*{a-bar-background-start}*/, #111 /*{a-bar-background-end}*/); /* Opera 11.10+ */\n\
    background-image:         linear-gradient( #3c3c3c /*{a-bar-background-start}*/, #111 /*{a-bar-background-end}*/);\n\
}\n\
\n\
.ui-bar-a .ui-link-inherit {\n\
    color: #fff /*{a-bar-color}*/;\n\
}'

    expectedFixed = '.ui-bar-a {\n\
    border: 1px solid #333;\n\
    background-image: -webkit-gradient(linear,left top,left bottom,from(#3C3C3C),to(#111));\n\
    background-image: -webkit-linear-gradient(#3C3C3C,#111);\n\
    background-image: -moz-linear-gradient(#3C3C3C,#111);\n\
    background-image: -ms-linear-gradient(#3C3C3C,#111);\n\
    background-image: -o-linear-gradient(#3C3C3C,#111);\n\
    background: #111;\n\
    background-image: linear-gradient(#3C3C3C,#111);\n\
    color: #FFF;\n\
    font-weight: bold;\n\
    text-shadow: 0 -1px 1px #000;\n\
}\n\
\n\
.ui-bar-a .ui-link-inherit {\n\
    color: #FFF;\n\
}'

    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(expectedFixed.trim(), msg.trim(), 'complicated statement is ok')
}