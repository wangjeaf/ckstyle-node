var doRuleDetect = require('./Hacks').doRuleDetect
var doRuleSetDetect = require('./Hacks').doRuleSetDetect
var doExtraDetect = require('./Hacks').doExtraDetect

var Browser = {
    handleRule: function(rule) {
        rule.browser = doRuleDetect(rule.fixedName, rule.fixedValue)
    },
    handleRuleSet: function(ruleSet) {
        ruleSet.browser = doRuleSetDetect(ruleSet.selector)
    },
    handleNestedStatement: function(statement) {
        statement.browser = doExtraDetect(statement.selector)
    }
}

exports.Browser = Browser


// if (!module.parent) {
//     var obj = {
//         fixedName: 'a',
//         fixedValue: 'expression(321)'
//     };
//     var res = Browser.handleRule(obj)
//     console.log(obj.browser.toString(2))

//     var obj = {
//         selector: 'a[b=1]'
//     }
//     var res = Browser.handleRuleSet(obj);
//     console.log(obj.browser)

//     var obj = {
//         selector: '@media all and (-webkit-min-device-pixel-ratio:10000), not all and (-webkit-min-device-pixel-ratio:0)'
//     }
//     var res = Browser.handleNestedStatement(obj);
//     console.log(obj.browser)
// }