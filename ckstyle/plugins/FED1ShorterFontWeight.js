var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDShorterFontWeight = new Class(RuleChecker, function() {

    this.__init__ = function(self) {
        self.id = 'use-shorter-font-weight'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg = ''
    }

    this.fix = function(self, rule, config) {
        if (rule.name == 'font' || rule.name == 'font-weight') {
            rule.fixedValue = helper.replaceFontWeights(rule.fixedValue)
        }
    }

    this.__doc__ = {
        "summary": "用更短的取值，替换等价的font-weight值",
        "desc": "有些颜色值是可以等价替换的，比如<code>normal: 400</code> <code>bold: 700</code>，后者更短",
        "w3c": 'http://www.w3.org/TR/CSS21/fonts.html#font-boldness'
    }
})