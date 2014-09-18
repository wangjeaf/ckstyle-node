var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');

module.exports = global.FEDMultiLineSelectors = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'multi-line-selector'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_multiSelectorBeforeSemicolon = 'should not have "space" before semicolon in "${selector}"'
        self.errorMsg_multiSelectorBeforeSemicolon = 'should not have "space" after semicolon in "${selector}"'
        self.errorMsg_shouldEnter = 'should enter in multi-selector, in "${selector}"'
        self.errorMsg_tooManyEnters = 'too many "enter"s in "${selector}"'
        self.errorMsg_startsWithSpace = 'selector should not start with "space" in "${selector}"'
        self.errorMsg_extraSpaceAfterComma = 'extra "space" after comma in "${selector}"'
        self.errorMsg_extraSpaceBeforeComma = 'extra "space" before comma in "${selector}"'
        self.errorMsg_commaInTheEnd = 'comma should at the end of selector in "${selector}"'
        self.errorMsg_shouldAddSpaceForLast = 'should add "space" for last selector of "${selector}"'
        self.errorMsg_shouldNotEnterAtTheEnd = 'should not "enter" at the end of "${selector}"'
        self.errorMsg_selectorEndsWithSpace = 'selector should end with only one space "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        var selector = ruleSet.roughSelector

        if (!helper.endswith(selector, ' ') || helper.endswith(selector, '  ')) {
            self.errorMsg = self.errorMsg_selectorEndsWithSpace
            return false
        }

        if (selector.indexOf(',') == -1)
            return true

        if (helper.endswith(selector.replace(/\s+/g, ''), '\n')) {
            self.errorMsg = self.errorMsg_shouldNotEnterAtTheEnd
            return false
        }

        if (selector.trim().indexOf('\n') == -1) {
            self.errorMsg = self.errorMsg_shouldEnter
            return false
        }

        var selectors = selector.split('\n')
        var length = helper.len(selectors)

        if (helper.len(selector.split(',')) != helper.len(selector.trim().split('\n'))) {
            self.errorMsg = self.errorMsg_tooManyEnters
            return false
        }

        var realSelectors = []
        selectors.forEach(function(s) {
            if (s.trim() != '')
                realSelectors.push(s)
        })

        var counter = 0
        var length = helper.len(realSelectors)
        for(var i = 0; i < realSelectors.length; i++) {
            var current = realSelectors[i];
            counter = counter + 1
            var stripped = current.trim()
            if (stripped == '')
                continue
            if (helper.startswith(current, ' ')) {
                self.errorMsg = self.errorMsg_startsWithSpace
                return false
            }
            if (helper.endswith(stripped, ' ,')) {
                self.errorMsg = self.errorMsg_extraSpaceBeforeComma
                return false
            }
            if (helper.endswith(current, ' ') && helper.endswith(stripped, ',')) {
                self.errorMsg = self.errorMsg_extraSpaceAfterComma
                return false
            }
            if (counter == length && !helper.endswith(current, ' ')) {
                self.errorMsg = self.errorMsg_shouldAddSpaceForLast
                return false
            }
            if (counter != length && stripped.indexOf(',') == -1) {
                self.errorMsg = self.errorMsg_commaInTheEnd
                return false
            }
        }
        return true 
    }

    this.__doc__ = {
        "summary":"多行CSS风格的选择器检查",
        "desc":"多行风格下，每一个选择器单独占一行，并以逗号结尾，例如：<br>\
            <code>.a,</code><br>\
            <code>.b,</code><br>\
            <code>.c {</code><br>\
            <code>&nbsp;&nbsp;&nbsp;&nbsp;width: 100px;</code><br>\
            <code>}</code>\
        "
    }
})
