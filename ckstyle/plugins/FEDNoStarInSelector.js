var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker

module.exports = global.FEDNoStarInSelector = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'no-star-in-selector'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'please remove low performance selector "*" from "${selector}"'
    }

    this.check = function (self, ruleSet, config) {
        var selector = ruleSet.selector;
        if (selector.indexOf('*') == -1)
            return true;

        var replaced = selector.replace(' ', '');
        if (this.startWith(replaced, '*html') || this.startWith(replaced, '*+html'))
            return true;

        if (replaced.indexOf('*:not') != -1)
            return true;

        // give it to FEDHighPerformanceSelector.py
        if (replaced.indexOf('*=') != -1 && (replaced.split('*')).length == 2) {
            return true;
        }

        return false;

    }

    this.startWith = function (self,v, str) {
        if (str[0] == '*') {
            str = '\\' + str
        }
        //console.log(v)

        var reg = new RegExp("^" + str);
        return reg.test(v.replace(/\'"/g, ''));
    }

    this.__doc__ = {
        "summary" : "不要在选择器中使用星号",
        "desc" : "禁止在选择器中加入<code>*</code>来选择所有元素，例如：\
            <br><br><code>*html</code> <code>*+html</code> <code>*:not</code>等几种特殊hack除外"
    }
})