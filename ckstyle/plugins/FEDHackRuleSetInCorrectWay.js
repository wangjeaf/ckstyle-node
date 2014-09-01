var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var ExtraChecker = base.ExtraChecker
var helper = require('./helper');

module.exports = global.FEDHackRuleSetInCorrectWay = new Class(ExtraChecker, function() {

    this.__init__ = function(self) {
        self.id = 'hack-ruleset'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'not correct hacking way in "${selector}"'
    }

    this.check = function(self, rule, config) {
        if (!ruleSet.nested)
            return true

        var selector = ruleSet.selector.trim()
        if (selector.indexOf('@-moz-document') != -1) {
            if (selector != '@-moz-document url-prefix()') {
                return false
            }
        }

        if (selector.indexOf('-webkit-min-device-pixel-ratio:0') != -1) {
            if (selector != '@media screen and (-webkit-min-device-pixel-ratio:0)' && 
                selector.indexOf('-webkit-min-device-pixel-ratio:10000') == -1) {
                return false
            }
        }

        if (selector.indexOf('-webkit-min-device-pixel-ratio:10000') != -1) {
            if (selector.indexOf('@media all') == -1 || 
                selector.indexOf('not all and') == -1 || 
                selector.indexOf('-webkit-min-device-pixel-ratio:0') == -1) {
                return false
            }
        }

        return true 
    }

    this.__doc__ = {
        "summary":"hack规则时的检查",
        "desc":"针对Firefox Opera Safari等浏览器的 hack 方式， <strong>人人FED CSS编码规范</strong>中有详细的描述， \
            不允许使用规定之外的方式进行规则级别的hack"
    }
});