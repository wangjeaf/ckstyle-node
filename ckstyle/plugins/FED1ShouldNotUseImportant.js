var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDShouldNotUseImportant = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'do-not-use-important'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'Should not use !important in "${name}" of "${selector}"'
    }

    this.check = function(self, rule, config) {
        value = rule.value
        if (value.replace(/\s+/g, '').indexOf('!important') != -1) {
            return false
        }
        return true 
    }

    this.__doc__ = {
        "summary":"不要使用!important",
        "desc":"CSS中不要使用<code>!important</code>"
    }
})