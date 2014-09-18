var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');
var Browser = require('../browsers/Detector').Browser

module.exports = global.FEDDistinguishBrowserRuleSet = new Class(RuleSetChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'ruleset-for-browsers'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        return true
    }

    this.fix = function(self, ruleSet, config) {
        Browser.handleRuleSet(ruleSet)
    }

    this.__doc__ = {
        "summary":"在规则集级别区分浏览器",
        "desc":"目的是针对不同的浏览器，生成不同的CSS规则集"
    }
})
