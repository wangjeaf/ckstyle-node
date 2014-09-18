var doFix = require('./helper').doFix;

exports.doTest = function() {
    go()
}

function go() {
    css = '.theme-hot li {\n\
    float: left;\n\
    padding: 0 10px 0 2px;\n\
    #padding: 1px 10px 0 2px;\n\
    padding: 1px 10px 0 2px\\0;\n\
    _padding: 3px 10px 0 2px;\n\
}'

    expectedFixed = '.theme-hot li {\n\
    float: left;\n\
    #padding: 1px 10px 0 2px;\n\
    padding: 1px 10px 0 2px\\0;\n\
    _padding: 3px 10px 0 2px;\n\
}'

    var msg = doFix(css, '')[1]
    equal(msg.trim(), expectedFixed.trim(), '#padding is ok, do not combine attr which in hack')   
}