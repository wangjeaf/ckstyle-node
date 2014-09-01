var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper')

var pattern = /\d+/g

module.exports = global.FEDNoSimpleNumberInSelector = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'number-in-selector'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'do not simply use 1,2,3 as selector(use v1/step1/item1), in "${selector}"'
    }

    this.check = function (self, ruleSet, config) {
        var selector = ruleSet.selector

        if (selector.indexOf('@media') != -1)
            return true
            
        var found = selector.match(pattern)

        if (found) {
            for(var i = 0; i < found.length; i++) {
                var x = found[i]
                if (selector.indexOf('v' + x) == -1 && 
                    selector.indexOf('step' + x) == -1 && 
                    selector.indexOf('item' + x) == -1 && 
                    selector.indexOf('h' + x) == -1)
                    return false
            }
        }
        return true 
    }

    this.__doc__ = {
        "summary":"不要在选择器中使用简单数字",
        "desc":"在业务代码的css中，选择器中不要使用简单的 <code>1, 2, 3</code> 来进行命名，下面的命名方式就是错误的：<br>\
            <code>.test1</code> <code>.main1</code>，但是允许使用 <code>v1</code> <code>step1</code> <code>item1</code> \
            来代表版本、步骤、第几个元素的意思"
    }
})
