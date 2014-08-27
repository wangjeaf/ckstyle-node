var doFix = require('./helper').doFix;

exports.doTest = function() {
    _lower()
    _upper()
}

function _lower() {
    var result = doFix('.test {width:100px;}', '')
    var fixer = result[0]
    var msg = result[1]
    
    styleSheet = fixer.getStyleSheet()
    ruleSet = styleSheet.getRuleSets()[0]
    equal(ruleSet.fixedSelector, '.test', 'selector lower is ok')
}

function _upper() {
    // if fix upper to lower, will cause error in HTML, do not do evil
    return
    var result = doFix('.TEST {width:100px;}', '')
    var fixer = result[0]
    var msg = result[1]
    styleSheet = fixer.getStyleSheet()
    ruleSet = styleSheet.getRuleSets()[0]
    equal(ruleSet.fixedSelector, '.test', 'selector all upper is ok')

    var result = doFix('.Test {width:100px;}', '')
    var fixer = result[0]
    var msg = result[1]
    styleSheet = fixer.getStyleSheet()
    ruleSet = styleSheet.getRuleSets()[0]
    equal(ruleSet.fixedSelector, '.test', 'selector one upper is ok')

    var result = doFix('.Test-WRAPPER {width:100px;}', '')
    var fixer = result[0]
    var msg = result[1]
    styleSheet = fixer.getStyleSheet()
    ruleSet = styleSheet.getRuleSets()[0]
    equal(ruleSet.fixedSelector, '.test-wrapper', 'selector upper with - is ok')
}