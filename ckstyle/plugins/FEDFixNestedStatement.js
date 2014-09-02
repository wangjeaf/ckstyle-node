var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var ExtraChecker = base.ExtraChecker
var helper = require('./helper');

module.exports = global.FEDFixNestedStatement = new Class(ExtraChecker, function() {

    this.__init__ = function(self) {
        self.id = 'fix-nested-ruleset'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = ''
        self._private = true
    }

    this.check = function(self, ruleSet, config) {
        return true 
    }

    this.fix = function(self, ruleSet, config) {
        if (!ruleSet.nested)
            return

        ruleSet.fixedSelector = ruleSet.fixedSelector.replace(/"/g, '\'')
        
        var modulePath = '../doCssFix';
        if (config.operation == 'compress') {
            modulePath = '../doCssCompress'
        }
        
        var statement = ruleSet.fixedStatement

        if (config['operation'] == 'compress') {
            var prepare = require(modulePath).prepare
            var checker = prepare(statement, '', config)
            // 嵌套的CSS，如果是压缩，也需要精简
            var msg = checker.doCompress(config._curBrowser)
            ruleSet.fixedStatement = msg
        } else {
            var doFix = require(modulePath).doFix
            var msg = doFix(statement, '', config)[1]
            ruleSet.fixedStatement = msg
        }
    }

    this.__doc__ = {
        "summary":"修复嵌套的CSS",
        "desc":"@keyframes, @media之类的"
    }
});
