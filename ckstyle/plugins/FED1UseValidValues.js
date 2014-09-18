var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDUseValidValues = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'valid-values'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg_rough = '%s in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        return true
    }

    this.__doc__ = {
        "summary":"不正确的属性取值",
        "desc":"检查不正确的属性取值，比如： <code>width: underline;</code> 等"
    }
})