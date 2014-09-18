var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');

module.exports = global.FEDMultiLineBraces = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'multi-line-brace'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_shouldEnterAfterOpenningBrace = 'should "enter" after the opening brace in "${selector}"'
        self.errorMsg_shouldEnterBeforeClosingBrace = 'should "enter" before the closing brace in "${selector}"'
        self.errorMsg_extraSpaceAfterOpeningBrace = 'extra "space" after the opening brace in "${selector}"'
        self.errorMsg_everyAttrShouldInSingleLine = 'every name/value should in single line in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        var singleLine = ruleSet.getSingleLineFlag()
        if (singleLine)
            return true

        var value = ruleSet.roughValue
        var splited = value.split('\n')
        if (splited[0].trim() != '') {
            self.errorMsg = self.errorMsg_shouldEnterAfterOpenningBrace
            return false
        }

        if (splited[0].trim() == '' && helper.startswith(splited[0], ' ')) {
            self.errorMsg = self.errorMsg_extraSpaceAfterOpeningBrace
            return false
        }

        var ruleLength = helper.len(ruleSet.getRules())
        if (ruleLength != 0 && helper.len(value.trim().split('\n')) != ruleLength) {
            self.errorMsg = self.errorMsg_everyAttrShouldInSingleLine
            return false
        }

        if (!helper.endswith(value.replace(' ', ''), '\n')) {
            self.errorMsg = self.errorMsg_shouldEnterBeforeClosingBrace
            return false
        }

        return true 

    }

    this.__doc__ = {
        "summary":"多行CSS风格的括号检查",
        "desc":"用于检查多行风格下的 <code>{</code> 和 <code>}</code> 的编写风格，前后空格符和回车符的情况等。"
    }
})