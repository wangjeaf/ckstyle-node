var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var helper = require('./helper');

module.exports = global.FEDFontSizeShouldBePtOrPx = new Class(RuleChecker, function () {

    this.__init__ = function (self) {
        self.id = 'font-unit'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg_ptOrPx = 'font-size unit should be px/pt in "${selector}"'
        self.errorMsg_xsmall = 'font-size should not be small/medium/large in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, rule, config) {
        if (rule.name != 'font-size')
            return true

        var value = rule.value
        if (value.indexOf('small') != -1 || 
            value.indexOf('medium') != -1 || 
            value.indexOf('large') != -1) {
            self.errorMsg = self.errorMsg_xsmall
            return false
        }

        if (value == '0')
            return true

        if (helper.endswith(value, 'pt'))
            return true

        if (helper.endswith(value, 'px'))
            return true

        self.errorMsg = self.errorMsg_ptOrPx
        return false
    }

    this.__doc__ = {
        "summary":"字体的单位必须用px或pt",
        "desc":"字体的单位可以有很多种，比如 <code>px pt em %</code> 等等，为了统一取值，统一要求为 <code>px/pt</code> ， 例如：<br>\
            <code>font-size: 12px;</code><br>\
            <code>font-size: 14pt;</code>"
    }
})