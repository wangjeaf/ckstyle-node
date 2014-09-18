var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper')

module.exports = global.FEDCanNotSetFontFamily = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'no-font-family'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'can not set font-family for "${selector}"'
    }

    this.check = function(self, rule, config) {
        if (rule.name == 'font-family')
            return false

        if (rule.name == 'font') {
            // many fonts
            if (rule.value.indexOf(',') != -1)
                return false

            // one font
            var splited = rule.value.split(' ')
            if (helper.isFontFamilyName(splited[splited.length - 1])) {
                return false
            }
        }

        return true
    }

    this.__doc__ = {
        "summary":"不允许业务代码设置字体",
        "desc":"由于业务代码中随意设置字体，导致字体取值混乱，因此不允许随意在业务代码中设置字体"
    }
})