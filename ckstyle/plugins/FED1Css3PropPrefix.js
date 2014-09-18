var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var helper = require('./helper');

module.exports = global.FEDCss3PropPrefix = new Class(RuleChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'css3-with-prefix'
        self.errorLevel_keepInOrder = ERROR_LEVEL.WARNING
        self.errorLevel_missing = ERROR_LEVEL.ERROR
        self.errorLevel = ERROR_LEVEL.LOG

        self.errorMsg_keepInOrder = 'css3 prop "${name}" should keep in "-webkit-,-moz-,-ms-,-o-,std" order in "${selector}"'
        self.errorMsg_missing = 'css3 prop "${name}" missing some of "-webkit-,-moz-,-o-,std" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, rule, config) {
        var name = rule.name
        // only for css3 props
        if (!helper.isCss3Prop(name))
            return true

        if (!helper.isCss3PrefixProp(name))
            return true

        if (helper.doNotNeedPrefixNow(name))
            return true
        
        var ruleSet = rule.getRuleSet()
        var webkitName = '-webkit-' + name
        var mozName = '-moz-' + name
        var msName = '-ms-' + name // not necessary
        var oName = '-o-' + name

        if (!(ruleSet.existRoughNames(webkitName) 
                && ruleSet.existRoughNames(mozName)
                && ruleSet.existRoughNames(oName)
                && ruleSet.existRoughNames(name))) {
            self.errorMsg = self.errorMsg_missing
            self.errorLevel = self.errorLevel_missing
            return false
        }

        // in order -webkit-  -moz-  -ms-  -o-  std
        var webkit = ruleSet.indexOf(webkitName)
        var moz = ruleSet.indexOf(mozName)
        var ms = ruleSet.indexOf(msName)
        if (ms == -1)
            ms = moz
        var o = ruleSet.indexOf(oName)
        var std = ruleSet.indexOf(name)

        if (!(webkit < moz && moz <= ms && ms < o && o < std)) {
            self.errorMsg = self.errorMsg_keepInOrder
            self.errorLevel = self.errorLevel_keepInOrder
            return false
        }
        return true
    }

    this.__doc__ = {
        "summary":"CSS3前缀相关检查",
        "desc":"CSS3属性的前缀，有的可以省略，比如：<br>\
            <code>border-radius</code><br>\
            有的是省略，必须写全，比如：<br><code>transition</code> <code>transform</code>等<br>\
            在编写顺序上，本工具要求按照<br>\
            <code>-webkit-,-moz-,-ms-,-o-,std</code><br>的顺序来编写，并且严格将属性的第一个字符对齐。"
    }
})