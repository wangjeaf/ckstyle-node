var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper')
var combiner = require('./combiners/CombinerFactory')

module.exports = global.FEDCombineInToOne = new Class(RuleSetChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'combine-into-one'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_rough = 'should combine "%s" to "%s" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, ruleSet, config) {
        var rules = ruleSet.getRules()
        var counter = self._countCanBeCombined(rules)
        for(var name in counter) {
            var value = counter[name];
            if (name == 'font' && helper.len(value) > 2 || name != 'font' && helper.len(value) > 1) {
                self.errorMsg = self.errorMsg_rough.replace('%s', value.join(',')).replace('%s', name)
                return false
            }
        }
        return true 
    }

    this.fix = function(self, ruleSet, config) {
        var rules = ruleSet.getRules()
        var counter = self._countCanBeCombined(rules, true)
        var rules = self._combineAttrs(rules, counter)
        ruleSet.setRules(rules)
    }

    this._countCanBeCombined = function(self, rules, forFix) {
        var counter = {}
        rules.forEach(function(rule) {
            var name = rule.name
            if (rule.name != rule.strippedName)
                return
            // do not do any hack combine
            if (helper.containsHack(rule))
                return
            // -moz-border-radius, -o-border-radius is not for me
            if (helper.isCss3PrefixProp(name))
                return

            var bigger = helper.canBeCombined(name)
            if (bigger) {
                if (bigger in counter) {
                    if (forFix) {
                        counter[bigger].push([name, rule.fixedName, rule.fixedValue])
                    } else {
                        counter[bigger].push(name)
                    }
                } else {
                    if (forFix) {
                        counter[bigger] = [[name, rule.fixedName, rule.fixedValue]]
                    } else {
                        counter[bigger] = [name]
                    }
                }
            }
        })
        return counter
    }

    this._combineAttrs = function(self, rules, counter) {
        var originRules = rules
        for(var name in counter) {
            var value = counter[name]
            var tmp = combiner.doCombine(name, value)
            var combined = tmp[0]
            var deleted = tmp[1]
            var hasFather = tmp[2]
            if (!combined)
                continue

            var newRules = []
            originRules.forEach(function(rule) {
                if (helper.containsHack(rule)) {
                    newRules.push(rule)
                    return
                }
                // it is what i want
                if (rule.fixedName == name) {
                    rule.fixedValue = combined
                    newRules.push(rule)
                    return
                }
                // it is what i want to delete
                if (deleted.indexOf(rule.fixedName) != -1) {
                    if (!hasFather) {
                        rule.reset(name, combined)
                        newRules.push(rule)
                        hasFather = true
                    }
                    return
                }
                newRules.push(rule)
            })
            originRules = newRules
        }
        return originRules
    }

    this.__doc__ = {
        "summary":"将多个子样式合并",
        "desc":"有的子样式可以合并为总样式，包括\
            <code>margin</code> <code>padding</code> <code>font</code> <code>background</code> <code>border</code>\
            等，合并以后可以获得更好的执行效率和压缩效果，<br/>\
            例如：<br/>\
            <code>.test {margin:4px; margin-right:0;}</code><br/>\
            <code>==></code><br/>\
            <code>.test{margin:4px 0 4px 4px}</code><br/>\
        "
    }
})