var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDReplaceBorderZeroWithBorderNone = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'no-border-zero'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_borderWidth = 'replace "border-width: 0" with "border-width: none" in "${selector}"'
        self.errorMsg_border = 'replace "border: 0" with "border: none" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        if (rule.name == 'border' && rule.value == '0') {
            self.errorMsg = self.errorMsg_border
            return false
        }

        if (/border-.*width/.test(rule.name) && rule.value == '0') {
            self.errorMsg = self.errorMsg_borderWidth
            return false
        }

        return true
    }

    this.__doc__ = {
        "summary":"用border:none替换border:0",
        "desc":"<code>border:0</code> 实际上是有border的，只不过宽度为0， 而 <code>border:none;</code>\
            是根本没有border的，对于浏览器来说后者的效率高，但是要注意，后者的代码长度稍微长一些。"
    }
})