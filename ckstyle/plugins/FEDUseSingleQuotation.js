var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker

module.exports = global.FEDUseSingleQuotation = new Class(RuleChecker, function() {

    this.__init__ = function(self) {
        self.always = true
        self.id = 'single-quotation'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'replace " with \' in "${selector}"'
    }

    this.check = function(self, rule, config) {
        if (self._findDouble(rule.value)) {
            return false
        }

        return true
    }

    this.fix = function(self, rule, config) {
        if (self._findDouble(rule.value)) {
            rule.fixedValue = rule.fixedValue.replace(/"/g, "'")
        }
    }

    this._findDouble = function(self, value) {
        return value.indexOf('"') != -1
    }

    this.__doc__ = {
        "summary":"使用单引号",
        "desc": "CSS的属性取值一律使用单引号<code>'</code>， 不允许使用双引号"
    }
})