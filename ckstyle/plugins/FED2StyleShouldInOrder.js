var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDStyleShouldInOrder = new Class(RuleSetChecker, function() {

    this.__init__ = function(self) {
        self.id = 'keep-in-order'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_rough = '"%s" should after "%s" in "${selector}" (order: display/box/text/other/css3)'
        self.errorMsg = ''
    }

    this.check = function(self, ruleSet, config) {
        rules = ruleSet.getRules()
        if (rules.length < 2)
            return true

        var order = self._generateNameOrderMapping(rules)
        length = helper.len(order)
        for(var i = 0; i < order.length; i++) {
            if (i == length - 1)
                break
            var current = order[i]
            var nextAttr = order[i + 1]

            if (current[0] > nextAttr[0]) {
                self.errorMsg = self.errorMsg_rough.replace('%s', current[1]).replace('%s', nextAttr[1]);
                return false
            }
        }
        return true 
    }

    this.fix = function(self, ruleSet, config) {
        rules = ruleSet.getRules()
        if (rules.length < 2)
            return true

        function comp(a, b) {
            if (a[0] != b[0]) {
                return a[0] - b[0]
            }
            var a1 = a[1].fixedValue
            var b1 = b[1].fixedValue
            return helper.getCss3PrefixValue(a1) - helper.getCss3PrefixValue(b1)
        }

        var mapping = self._generateNameRuleMapping(rules)
        mapping = mapping.sort(comp)
        var sortedRules = []
        for(var i = 0; i < mapping.length; i++) {
            sortedRules.push(mapping[i][1])
        }
        ruleSet.setRules(sortedRules)
    }

    this._generateNameOrderMapping = function(self, rules) {
        var collector = [];
        rules.forEach(function(rule) {
            collector.push([helper.getAttrOrder(rule.name, rule.strippedName), rule.strippedName])
        })
        return collector;
    }

    this._generateNameRuleMapping = function(self, rules) {
        var collector = [];
        rules.forEach(function(rule) {
            collector.push([helper.getAttrOrder(rule.name, rule.strippedName), rule])
        })
        return collector;
    }


    this.__doc__ = {
        "summary":"属性应该按照推荐的顺序编写",
        "desc":"相同的CSS属性，如果按照推荐的顺序来编写，浏览器的处理性能会更高，推荐的顺序一般为：<br>\
            显示属性 => 盒模型属性 => 背景/行高 => 文本属性 => 其他"
    }
})

    