var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var helper = require('./helper');
var Browser = require('../browsers/Detector').Browser

module.exports = global.FEDDistinguishBrowserRule = new Class(RuleChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'rule-for-browsers'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = ''
    }

    this.check = function (self, rule, config) {
        return true
    }

    this.fix = function(self, rule, config) {
        Browser.handleRule(rule)
    }

    this.__doc__ = {
        "summary":"在属性级别区分浏览器",
        "desc":"目的是针对不同的浏览器，生成不同的CSS"
    }
})