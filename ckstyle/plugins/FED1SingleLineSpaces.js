var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDSingleLineSpaces = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'single-line-space'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_noSpace = 'should have one "space" before "${name}" in "${selector}"'
        self.errorMsg_spaceEnd = 'should not have "space" after "${name}" in "${selector}"'
        self.errorMsg_noSpaceBeforeValue = 'should have one "space" before value of "${name}" in "${selector}"'
        self.errorMsg_extraSpaceAfterValue = 'found extra "space" after value of "${name}" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        var singleLine = rule.getRuleSet().getSingleLineFlag()
        if (!singleLine)
            return true

        if (!(rule.roughName.indexOf(' ') == 0)) {
            self.errorMsg = self.errorMsg_noSpace
            return false
        }

        if (rule.roughName.slice(-1) == ' ') {
            self.errorMsg = self.errorMsg_spaceEnd
            return false
        }
        
        if (!(rule.roughValue.indexOf(' ') == 0)) {
            self.errorMsg = self.errorMsg_noSpaceBeforeValue
            return false
        }

        var value = rule.roughValue.trim()
        if (value.slice(-2) == ' ;' || value.slice(-1) == ' ') {
            self.errorMsg = self.errorMsg_extraSpaceAfterValue
            return false
        }
        return true 
    }

    this.__doc__ = {
        "summary":"单行的空格检查",
        "desc":"单行CSS编码风格相关的空格检查，具体内容请参见CSS编码规范"
    }
})
