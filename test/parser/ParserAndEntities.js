var CssParser = require('./helper').CssParser

exports.doTest = function() {
    _oneRule()
    _twoAndMoreRules()
    _rulesInComments()
    _strangeComments()
}

function _strangeComments() {
    parser = new CssParser('/* test0 /* test1 */ .test {width: 100px;}')
    parser.doParse()
    equal(len(parser.styleSheet.getRuleSets()), 1, 'one ruleset')
    ruleSet1 = parser.styleSheet.getRuleSetBySelector('.test')
    equal(ruleSet1.comment, '/* test0  test1 */', 'strange comment is ok')
}

function _rulesInComments() {
    parser = new CssParser('/* test0 */ /* test1 */ .test {width: 100px;} \n /* test2 */ /* test3 */ .test2 {width: 100px;}')
    parser.doParse()

    equal(len(parser.styleSheet.getRuleSets()), 2, 'two ruleSets')
    ruleSet1 = parser.styleSheet.getRuleSetBySelector('.test')
    ruleSet2 = parser.styleSheet.getRuleSetBySelector('.test2')
    ok(ruleSet1.comment.indexOf('test0') != -1, 'comment contains test0')
    ok(ruleSet1.comment.indexOf('test1') != -1, 'comment contains test1')

    ok(ruleSet2.comment.indexOf('test2') != -1, 'comment contains test2')
    ok(ruleSet2.comment.indexOf('test3') != -1, 'comment contains test3')

    equal(len(ruleSet2.comment.split('\n')), 2, 'string seperated by enter')
    equal(ruleSet1.selector, '.test', 'selector is ok')
    equal(ruleSet2.selector, '.test2', 'selector is ok')

    equal(ruleSet1.getRules()[0].name, 'width', 'first attr of selector 1 is width')
    equal(ruleSet2.getRules()[0].name, 'width', 'first attr of selector 2 is width')

    equal(len(ruleSet1.getRules()), 1, 'one rule in selector 1')
    equal(len(ruleSet2.getRules()), 1, 'one rule in selector 2')
}

function _twoAndMoreRules() {
    parser = new CssParser('.testa {width: 100px; \nheight: 100px;} .testb {width: 100px;}')
    parser.doParse()
    ok(parser.styleSheet, 'parser.styleSheet is not None')
    equal(len(parser.styleSheet.getRuleSets()), 2, 'two rules')
    ruleSet1 = parser.styleSheet.getRuleSetBySelector('.testa')
    ok(ruleSet1, '.testa found')
    equal(len(ruleSet1.getRules()), 2, 'two rules')
    equal(ruleSet1.getRuleByName('width').value, '100px', 'value of width is 100px')
    equal(ruleSet1.getRuleByName('height').value, '100px', 'value of height is 100px')

    ruleSet2 = parser.styleSheet.getRuleSetBySelector('.testb')
    ok(ruleSet2, '.testb found')
    equal(ruleSet2.getRuleByName('width').value, '100px', 'value of width in .testb')
}

function _oneRule() {
    parser = new CssParser('.test {_width : 100px;}')
    parser.doParse()
    ok(parser, 'parser is not None')
    ok(parser.styleSheet, 'parser.styleSheet is not None')
    equal(len(parser.styleSheet.getRuleSets()), 1, 'one rule set')

    ruleSet = parser.styleSheet.getRuleSets()[0]
    equal(ruleSet.selector, '.test', 'selector is .test')
    equal(ruleSet.roughSelector, '.test ', 'roughSelector contains space')
    equal(len(ruleSet.getRules()), 1, 'one rule')

    rule = ruleSet.getRules()[0]
    equal(rule.name, 'width', 'name is width')
    equal(rule.value, '100px', 'value is 100px')
    equal(rule.roughName, '_width ', 'roughName is _width, contains space')
    equal(rule.roughValue, ' 100px;', 'roughValue contains space')
    equal(rule.strippedName, '_width', 'strippedName is _width, no space')
    equal(rule.strippedValue, '100px;', 'strippedValue contains no space')
}