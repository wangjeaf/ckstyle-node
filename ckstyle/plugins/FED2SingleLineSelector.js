var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDSingleLineSelector = new Class(RuleSetChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'single-line-selector'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_noEnterInSingleSelector = 'should not "enter" at the end of "${selector}"'
        self.errorMsg_multiSelectorBeforeSemicolon = 'should not have "space" after semicolon in "${selector}"'
        self.errorMsg_shouldNotStartsWithSpace = 'should start with "space" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, ruleSet, config) {
        var selector = ruleSet.roughSelector
        if (selector.indexOf(',') != -1)
            return true

        if (selector.replace(/^\s+/, '').indexOf('\n') != -1) {
            self.errorMsg = self.errorMsg_noEnterInSingleSelector
            return false
        }

        var splited = selector.split('\n')
        var realSelector = splited[splited.length - 1]
        
        if (realSelector.indexOf(' ') == 0) {
            self.errorMsg = self.errorMsg_shouldNotStartsWithSpace
            return false
        }

        return true 
    }

    this.__doc__ = {
        "summary":"单行的选择器检查",
        "desc":"单行的选择器检查内容，请参考多行选择器检查和人人FED CSS编码规范"
    }
})