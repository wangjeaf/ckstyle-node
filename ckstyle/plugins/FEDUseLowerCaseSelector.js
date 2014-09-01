var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDUseLowerCaseSelector = new Class(RuleSetChecker, function() {
    this.__init__ = function(self) {
        self.id = 'lowercase-selector'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'selector should use lower case, in "${selector}"'
    }

    this.check = function(self, ruleSet, config) {
        var selector = ruleSet.selector
        if (selector.toLowerCase() != selector)
            return false

        return true 
    }

    this.fix = function(self, ruleSet, config) {
        return;
    }

    this.__doc__ = {
        "summary":"选择器用小写字母",
        "desc":"选择器应该用小写字母， 例如 <code>.demo</code> ， 不允许使用大写，例如： <code>.Demo .Test</code>"
    }
})
