var doFix = require('./helper').doFix;

exports.doTest = function() {
    _rgba()
    _rgba_no_space()
}

function _rgba_no_space() {
    css = '.test1 {\n\
        box-shadow: inset 0 0px 0 0 rgba(0,0px,0px,0.1);\n\
    }'

    var result = doFix(css, '')
    fixer = result[0]
    msg = result[1]
    expectedFixed = '.test1 {\n\
    box-shadow: inset 0 0 0 0 rgba(0,0,0,.1);\n\
}'
    equal(msg, expectedFixed, 'rgba no space is also ok')
}

function _rgba() {
    css = 'html {\n\
        -webkit-tap-highlight-color: rgba(0px, 0px, 0px, 0.1);\n\
    }'

    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]

    styleSheet = fixer.getStyleSheet()
    ruleSet = styleSheet.getRuleSets()[0]
    color = ruleSet.getRuleByName('tap-highlight-color')
    equal(color.fixedValue, 'rgba(0, 0, 0, .1)', 'tap-highlight-color is fixed')
    equal(color.value, 'rgba(0px, 0px, 0px, 0.1)', 'tap-highlight-color is ok')

    css = '.current-hot-films-ul {\n\
        -webkit-transition:all 0.5s ease-in-out 0s;\n\
           -moz-transition:all 0.5s ease-in-out 0s; \n\
             -o-transition:all 0.5s ease-in-out 0s;\n\
                transition:all 0.5s ease-in-out 0s;\n\
    }'
    expectedFixed = '.current-hot-films-ul {\n\
    -webkit-transition: all .5s ease-in-out 0s;\n\
       -moz-transition: all .5s ease-in-out 0s;\n\
         -o-transition: all .5s ease-in-out 0s;\n\
            transition: all .5s ease-in-out 0s;\n\
}'

    var msg = doFix(css, '')[1]
    equal(msg.trim(), expectedFixed.trim(), 'transition is ok, 0s can not be shorter')
}