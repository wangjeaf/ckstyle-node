var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDUnknownCssNameChecker = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'unknown-css-prop'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'unknown attribute name "${name}" found in "${selector}"'
    }

    this.check = function(self, rule, config) {
        return helper.isCssProp(rule.name.toLowerCase())
    }

    this.__doc__ = {
        "summary":"错误的css属性",
        "desc":"本工具会帮您查找错误的CSS属性，如果写错了，即可收到错误提示"
    }
})
