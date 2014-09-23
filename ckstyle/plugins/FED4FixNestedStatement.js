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
        var compressModulePath = '../doCssCompress'

        var statement = ruleSet.fixedStatement
        
        if (config.operation == 'fix') {
            var doFix = require(modulePath).doFix
            var msg = doFix(statement, '', config)[1]
            ruleSet.fixedStatement = msg
        }

        // compress it
        if (config.operation == 'compress') {
            var doCompress = require(compressModulePath).doCompress
            var msg = doCompress(statement, '', config)[1]
            ruleSet.compressedStatement = msg
        }
    }

    this.__doc__ = {
        "summary":"修复嵌套的CSS",
        "desc":"@keyframes, @media之类的"
    }
});
