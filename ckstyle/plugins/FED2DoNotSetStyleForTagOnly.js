var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');

module.exports = global.FEDDoNotSetStyleForTagOnly = new Class(RuleSetChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'no-style-for-tag';
        self.errorLevel = ERROR_LEVEL.ERROR;
        self.errorMsg = 'should not set style for html tag in "${selector}"';
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
            if (helper.isHTMLTag(s)) 
                return false
        }

        return true
    }

    this.__doc__ = {
        "summary":"不要为html tag设置样式",
        "desc":"除了重置 CSS(如Reset.css) 的相关设置，其他代码一律不允许为html tag设置样式。"
    }
})
