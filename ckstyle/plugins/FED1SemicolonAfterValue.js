var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDSemicolonAfterValue = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'add-semicolon'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'each rule in "${selector}" need semicolon in the end, "${name}" has not'
    }

    this.check = function(self, rule, config) {
        if (!(rule.roughValue.trim().slice(-1) == ';'))
            return false
        return true 
    }

    this.__doc__ = {
        "summary":"为每一个属性后添加分号",
        "desc":"按照CSS编码规范，每一个规则后面都必须加上分号 <code>;</code>"
    }
})