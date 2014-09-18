var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDTransChnFontFamilyNameIntoEng = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'no-chn-font-family'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'should not use chinese font family name in "${selector}"'
    }

    this.check = function(self, rule, config) {
        if (rule.name != 'font' && rule.name != 'font-family')
            return true

        if (helper.containsChnChar(rule.value))
            return false

        return true 
    }

    this.__doc__ = {
        "summary":"字体设置时使用英文",
        "desc":"有的字体设置可以通过中文和英文两者方式来声明，比如<br>\
            <code>微软雅黑</code> 和 <code>Microsoft Yahei</code> ，我们推荐用英文的方式来实现"
    }
})