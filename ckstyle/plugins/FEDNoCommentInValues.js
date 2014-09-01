var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;

module.exports = global.FEDNoCommentInValues = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'no-comment-in-value'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg = 'find css comment (/* */) in "${selector}"'
    }

    this.check = function(self, ruleSet, config) {
        if (ruleSet.roughValue.indexOf('/*') != -1 || 
            ruleSet.roughValue.indexOf('*/') != -1)
            return false
        return true 
    }
    
    this.__doc__ = {
        "summary":"不要在css属性中添加注释",
        "desc":"CSS的注释应该写在 <code>selector</code> 前面，属性中不允许添加css注释，例如：<br>\
            <code>.selector {</code><br>\
            <code>&nbsp;&nbsp;&nbsp;&nbsp;width: 100px;/*comment here*/</code><br>\
            <code>}</code>\
        "
    }
})