var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;

module.exports = global.FEDNoEmptyRuleSet = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'no-empty-ruleset';
        self.errorLevel = ERROR_LEVEL.ERROR;
        self.errorMsg = 'empty ruleset found "${selector}"';
    }

    this.check = function (self, ruleSet, config) {
        if (ruleSet.getRules().length == 0) {
            return false
        }
        return true
    }
    
    this.fix = function (self, ruleSet, config) {
        if (ruleSet.getRules().length == 0){
            styleSheet = ruleSet.getStyleSheet();
            styleSheet.removeRuleSet(ruleSet);
        }
    }

    this.__doc__ = {
        "summary" : "删除空的规则",
        "desc" : "空的CSS规则集是没有任何意义的，应该直接删除掉"
    }
})