var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');

module.exports = global.FEDDoNotSetStyleForSimpleSelector = new Class(RuleSetChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'no-style-for-simple-selector';
        self.errorLevel = ERROR_LEVEL.ERROR;
        self.errorMsg_rough = 'should not set style for "%s" in "${selector}"';
        self.errorMsg = '';
    }

    this.check = function (self, ruleSet, config) {
        var selector = ruleSet.selector.toLowerCase();
        if (selector.indexOf('@media') != -1)
            return true;

        if (selector.indexOf('@-moz-document') != -1)
            return true;

        var selectors = selector.split(',');
        for (var i = 0, l = selectors.length; i < l; i++) {
            var s = selectors[i].trim();
            if (helper.isSimpleSelector(s)) {
                self.errorMsg = self.errorMsg_rough.replace('%s', s);
                return false
            }
        }

        return true
    }

    this.__doc__ = {
        "summary" : "不要为简单选择器设置样式",
        "desc" : "一些简单的选择器，比如：<br> <code>.nav/.list/.content</code><br>非常容易造成属性的相互覆盖，因此在写这样的选择器时，最好加上前缀，比如<br><code>.module-name .nav</code><br><br>工具现有的简单选择器判断，请参考：<br><code>plugins/helper.js</code>"
    }
})