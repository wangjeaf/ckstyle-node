var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper')

module.exports = global.FEDFixCommentInValue = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'fix-comment-in-value'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = ''
        self._private = true
    }

    this.check = function(self, rule, config) {
        return true
    }   
    
    this.fix = function(self, rule, config) {
        if (rule.name == 'expression')
            return
        
        var value = rule.fixedValue
        if (value.indexOf('/*') == -1)
            return

        var splited = value.split('/*')
        var collector = []
        for(var i = 0; i < splited.length; i++) {
            var x = splited[i];
            tmp = x.split('*/')
            if (helper.len(tmp) == 1) {
                collector.push(tmp[0])
            } else {
                collector.push(tmp[1])
            }
        }
        rule.fixedValue = collector.join('')
    }

    this.__doc__ = {
        "summary":"修复属性中的注释",
        "desc":"width:/* fdasfdas */ 100px /* fdafdas */; ==> width:100px;"
    }
})
