var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDRemoveDuplicatedAttr = new Class(RuleSetChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'remove-duplicated-attr'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'has more than 1 ${name} in "${selector}"'
    }

    this.check = function(self, ruleSet, config) {
        var rules = ruleSet.getRules()
        var collector = []
        rules.forEach(function(rule) {
            var info = self.ruleInfo(rule)
            if (collector.indexOf(info) != -1)
                return false
            collector.push(info)
        })
        return true
    }

    this.fix = function(self, ruleSet, config) {
        // make sure we use the last statement, so reverse and filter and reverse again
        // [a1, a2, b, c] ==> [c, b, a2, a1] ==> [c, b, a2] ==> [a2, b, c]
        var rules = ruleSet.getRules()
        rules.reverse()
        var newRules = []
        var collector = []
        rules.forEach(function(rule) {
            var info = self.ruleInfo(rule)
            if (collector.indexOf(info) == -1) {
                collector.push(info)
                newRules.push(rule)
            }
        })
        newRules = newRules.reverse()
        ruleSet.setRules(newRules)
    }

    this.ruleInfo = function(self, rule) {
        var name = rule.fixedName || rule.strippedName
        var value = rule.fixedValue || rule.strippedValue
        if (helper.canOverride(name, value)) {
            return name;
        }
        return name + ':' + value
    }

    this.__doc__ = {
        "summary":"删除重复的属性设置",
        "desc":"如果在一个规则集中，对相同的两个属性进行了赋值，而且取值相同，则可以删除前面的赋值，例如：\
            <br>\
            <code>.test {</code><br>\
            <code>&nbsp;&nbsp;&nbsp;&nbsp;width: 100px;</code><br>\
            <code>&nbsp;&nbsp;&nbsp;&nbsp;width: 100px;</code><br>\
            <code>}</code><br>\
            <code>==></code><br>\
            <code>.test {</code><br>\
            <code>&nbsp;&nbsp;&nbsp;&nbsp;width: 100px;</code><br>\
            <code>}</code>"
    }
})    