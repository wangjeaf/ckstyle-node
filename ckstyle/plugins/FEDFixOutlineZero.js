var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker

module.exports = global.FEDFixOutlineZero = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'fix-outline-none'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'fix outline:none for "${selector}"'
    }

    this.check = function(self, rule, config) {
         if (rule.name == 'outline') {
            if (self._findOutlineNone(rule.value)){
                return false
            }
        }
        return true
    }   
    
    this.fix = function(self, rule, config) {
        if (rule.name == 'outline') {
            if (self._findOutlineNone(rule.value)){
                
                 rule.fixedValue = rule.fixedValue.replace(/none/, "0");
                 console.log(rule.fixedValue)
            }
        }
    }

    this._findOutlineNone = function(self, value) {
        return value.indexOf('none') !== -1
    }

    this.__doc__ = {
        "summary":"修复outline:none",
        "desc":"<code>outline:none</code> 和 <code>outline:0</code> 实现了相同的功能，但是后者的代码更简洁，便于压缩。"
    }
})