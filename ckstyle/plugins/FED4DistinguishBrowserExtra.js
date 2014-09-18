var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var ExtraChecker = base.ExtraChecker;
var helper = require('./helper');
var Browser = require('../browsers/Detector').Browser

module.exports = global.FEDDistinguishBrowserExtra = new Class(ExtraChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'extra-for-browsers'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        return true
    }

    this.fix = function(self, ruleSet, config) {
        if (!ruleSet.nested)
            return
        Browser.handleNestedStatement(ruleSet)
    }

    this.__doc__ = {
        "summary":"嵌套规则区分浏览器",
        "desc":"目的是针对不同的浏览器，生成不同的CSS规则集"
    }
})
