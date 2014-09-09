var helper = require('./helper')

exports.doTest = function() {
    _simple()
    _nocombine()
    _fixbug_from_apple()
}

function _nested_stmt() {
    var css = '@media only screen and (-webkit-min-device-pixel-ratio:1.5) and (orientation:portrait) and (max-device-width:768px),\n\
       only screen and         (min-device-pixel-ratio:1.5) and (orientation:portrait) and (max-device-width:768px) {\n\
    #globalheader { background:url(/global/nav/images/globalheader.png) repeat-x !important; }\n\
}'
    var expected = '@media only screen and (-webkit-min-device-pixel-ratio:1.5) and (orientation:portrait) and (max-device-width:768px),only screen and (min-device-pixel-ratio:1.5) and (orientation:portrait) and (max-device-width:768px) {\n\
    #globalheader {\n\
        background: url(/global/nav/images/globalheader.png) repeat-x !important;\n\
    }\n\
}'
    var res = helper.doFormat(css);
    equal(res.trim(), expected, 'nested ok')
}

function _simple() {
    var css = '.a {width: 100px; height: 200px;}'
    var expectedFormatted = '.a {\n\
    width: 100px;\n\
    height: 200px;\n\
}'
    var res = helper.doFormat(css);
    equal(res.trim(), expectedFormatted.trim(), 'simple format is ok')
}

function _nocombine() {
    var css = '.a {width: 100px;} .b{width: 100px}'
    var expectedFormatted = '.a {\n\
    width: 100px;\n\
}\n\
\n\
.b {\n\
    width: 100px;\n\
}'
    var res = helper.doFormat(css);
    equal(res.trim(), expectedFormatted.trim(), 'no combine when format is ok')
}


function _fixbug_from_apple() {
    var formated = helper.doFormat('#globalheader { background:#707070;\n\
        background:\n\
            -o-linear-gradient(top, rgba(0, 0, 0, .2) 0, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 0) 97%, rgba(0, 0, 0, .45) 100%),\n\
            -o-linear-gradient(left, rgba(0, 0, 0, .2) 0, rgba(0, 0, 0, 0) .2%, rgba(0, 0, 0, 0) 99.8%, rgba(0, 0, 0, .2) 100%),\n\
            -o-linear-gradient(bottom, #666 0, #5e5e5e 50%, #707070 51%, #808080 100%)\n\
        ;\n\
    }')

    var expected = '#globalheader {\n\
    background: #707070;\n\
    background: -o-linear-gradient(top,rgba(0,0,0,.2) 0,rgba(0,0,0,0) 5%,rgba(0,0,0,0) 97%,rgba(0,0,0,.45) 100%),-o-linear-gradient(left,rgba(0,0,0,.2) 0,rgba(0,0,0,0) .2%,rgba(0,0,0,0) 99.8%,rgba(0,0,0,.2) 100%),-o-linear-gradient(bottom,#666 0,#5e5e5e 50%,#707070 51%,#808080 100%);\n\
}'
    equal(formated, expected, 'strange comment is ok')
}