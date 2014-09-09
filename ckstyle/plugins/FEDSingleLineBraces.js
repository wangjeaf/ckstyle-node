var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker

module.exports = global.FEDSingleLineBraces = new Class(RuleSetChecker, function() {
    this.__init__ = function(self) {
        self.id = 'single-line-brace'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_openingBrace = 'should have "only one space" before the opening brace in "${selector}"'
        self.errorMsg_openingBraceEnd = 'should have "only one space" after the opening brace in "${selector}"'
        self.errorMsg_closingBrace = 'should have "only one space" before the closing brace in "${selector}"'
        self.errorMsg_closingBraceEnd = 'should have "only one space" before the closing brace in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, ruleSet, config) {
        var singleLine = ruleSet.getSingleLineFlag()
        if (!singleLine)
            return true
        var selector = ruleSet.roughSelector
        if (selector.indexOf(',') == -1) {
            if (selector.slice(-2) == '  ' || selector.slice(-1) != ' ') {
                self.errorMsg = self.errorMsg_openingBrace
                return false
            }
        } else {
            return true
        }

        var value = ruleSet.roughValue
        if (value.slice(0, 1) != ' ' || value.slice(0, 2) == '  ') {
            self.errorMsg = self.errorMsg_openingBraceEnd
            return false
        }
        if (value.slice(-1) != ' ' || value.slice(-2) == '  ') {
            self.errorMsg = self.errorMsg_closingBraceEnd
            return false
        }
        return true 
    }

    this.__doc__ = {
        "summary":"单行的括号检查",
        "desc":"与单行CSS编码风格相关的括号检查"
    }
})