var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDSelectorNoUnderLine = new Class(RuleSetChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'no-underline-in-selector'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'should not use _ in selector "${selector}"'
    }

    this.check = function(self, ruleSet, config) {
        var selector = ruleSet.selector
        if (selector.indexOf('_') != -1)
            return false
        return true
    }

    this.__doc__ = {
        "summary":"不要在选择器中使用下划线",
        "desc":"在selector中不要使用下划线 <code>_</code> ，可以使用中划线 <code>-</code>"
    }
})