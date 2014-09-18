var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDSafeUrlInValue = new Class(RuleChecker, function() {

    this.__init__ = function(self) {
        self.id = 'safe-url-in-value'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg_rough = 'unsafe "%s" value in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        var name = rule.name
        if (!helper.canContainUrl(name)) {
            return true
        }
        var value = rule.value
        if (value.indexOf('.js') != -1) {
            self.errorMsg = self.errorMsg_rough.replace('%s', name)
            return false
        }
        return true
    }

    this.__doc__ = {
        "summary": "不安全的取值",
        "desc": "检查不安全的取值，避免自定义脚本随意运行，比如： <code>background-image: url(http://a.com/b.js);</code> 等"
    }
})