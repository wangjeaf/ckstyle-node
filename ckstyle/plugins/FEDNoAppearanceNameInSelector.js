var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;

var helper = require('./helper');

module.exports = global.FEDDoNotSetStyleForTagOnly = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'no-appearance-word-in-selector'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_origin = 'should not use appearance word "%s" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        var selector = ruleSet.selector.toLowerCase();
        
        if(selector.indexOf('@media') != -1)
            return true;
        if(selector.indexOf('@-moz-document') != -1)
            return true;

        var word = helper.existsAppearanceWords(selector);
        
        if (word !== null){
            self.errorMsg = self.errorMsg_origin.replace('%s', word)
            return false
        }

        return true
    }

    this.__doc__ ={
        "summary":"选择器中避免表现相关的词汇",
        "desc":"避免将在selector中出现 <code>.red</code> <code>.left</code> 等描述性词汇，\
            用具体的实际意义来代替，比如 <code>.error</code> <code>.sidebar</code> "
    }
})