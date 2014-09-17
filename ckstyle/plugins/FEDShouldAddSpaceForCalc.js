var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper')

module.exports = global.FEDShouldAddSpaceForCalc = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'add-space-for-calc'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'can not set font-family for "${selector}"'
    }

    this.check = function(self, rule, config) {
        return true
    }

    this.fix = function(self, rule, config) {
        var reg = /calc\(.*?\)/g
        var value = rule.fixedValue
        var matched = value.match(reg)
        if (matched) {
            for(var i = 0; i < matched.length; i++) {
                var c = matched[i]
                value = value.replace(c, c.replace(/\s/g, '').replace('+', ' + ').replace('-', ' - '))
            }
            rule.fixedValue = value
        }
    }

    this.__doc__ = {
        "summary":"为calc的计算式中的+/-前后添加空格",
        "desc":"在某些浏览器中，不加空格将导致计算错误"
    }
})