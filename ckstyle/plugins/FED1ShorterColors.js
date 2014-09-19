var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDShorterColors = new Class(RuleChecker, function() {

    this.__init__ = function(self) {
        self.id = 'use-shorter-colors'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = ''
    }

    this.fix = function(self, rule, config) {
        rule.fixedValue = helper.replaceColors(rule.fixedValue)
        rule.fixedValue = helper.replaceRGB(rule.fixedValue)
    }

    this.__doc__ = {
        "summary": "用更短取值替换等价的颜色值",
        "desc": "有些颜色值是可以等价替换的，比如<code>antiquewhite: '#faebd7'</code>，后者更短"
    }
})