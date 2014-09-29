var RuleSet = require('./helper').RuleSet

exports.doTest = function() {
    _ruleSet()
}

function _ruleSet() {
    ruleSet = new RuleSet('   .test ', '  width:100px;height:100px;  ', '/* aa */   ', null)
    ok(!ruleSet.extra, 'ruleset is not extra')
    equal(ruleSet.selector, '.test', 'selector is ok')
    equal(ruleSet.roughSelector, '   .test ', 'roughSelector is ok')
    equal(ruleSet.roughValue, '  width:100px;height:100px;  ', 'roughValue is ok')
    equal(ruleSet.roughComment, '/* aa */   ', 'rough comment is ok')
    equal(ruleSet.values, 'width:100px;height:100px;', 'values is ok')
    ok(ruleSet.singleLineFlag, 'it is single line')
    ok(ruleSet.getSingleLineFlag(), 'it is single line')
    equal(ruleSet.getStyleSheet(), null, 'no stylesheet')

    equal(len(ruleSet.getRules()), 0, 'no rules')
    equal(ruleSet.indexOf('width'), -1, 'no _width')
    equal(ruleSet.existNames('width'), false, 'no width again')
    equal(ruleSet.existNames('  _width '), false, 'no rough _width')
    equal(ruleSet.getRuleByName('width'), null, 'can not find width')
    equal(ruleSet.getRuleByRoughName('  _width '), null, 'can not find _width')

    ruleSet.addRuleByStr('  _width ', ' 100px; ')
    
    equal(len(ruleSet.getRules()), 1, 'one rule')
    equal(ruleSet.indexOf('_width'), 0, 'found width')
    equal(ruleSet.existNames('width'), true, 'found width again')
    equal(ruleSet.existRoughNames('  _width '), true, 'found rough width')
    equal(ruleSet.getRuleByName('width').value, '100px', 'find width')
    equal(ruleSet.getRuleByRoughName('  _width ').value, '100px', 'find width by rough name')
    equal(ruleSet.getRuleByStrippedName('_width').value, '100px', 'find width by stripped name')

    ruleSet.addRuleByStr('height', '100px; ')
    equal(len(ruleSet.getRules()), 2, 'two rules')
    equal(ruleSet.getRules()[0].name, 'width', 'width is first')
    equal(ruleSet.getRules()[1].name, 'height', 'height is second')

    ruleSet.eachRule(function(rule) {
        equal(!!rule.name, true, 'name ok')
        equal(!!rule.value, true, 'value ok')
    })
}