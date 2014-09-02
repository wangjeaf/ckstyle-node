var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

var pattern_unit = /^[0]+[\w]+/g
var replacer_unit = /,\s+/g

module.exports = global.FEDNoUnitAfterZero = new Class(RuleChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'del-unit-after-zero'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg = 'unit should be removed when meet 0 in "${selector}"'
    }

    this.check = function(self, rule, config) {
        var values = rule.value.split(' ')

        for(var i = 0; i < values.length; i++) {
            var v = values[i];
            v = v.trim()
            if (v.indexOf('(') != -1) {
                matched = self._startsWithZero(v.split('(')[1])
            } else {
                matched = self._startsWithZero(v)
            }
            if (!matched)
                continue

            for(var j = 0; j < matched.length; j++) {
                var m = matched[j]
                if (m != '0s') {
                    return false;
                }
            }
        }

        return true 
    }

    this.fix = function(self, rule, config) {
        if (rule.name == 'expression')
            return

        var fixed = rule.fixedValue
        rule.fixedValue = rule.fixedValue.replace(/,/g, ', ');

        var collector = []
        rule.fixedValue.split(' ').forEach(function(v) {
            v = v.trim()
            if (v.indexOf('(') != -1) {
                matched = self._startsWithZero(v.split('(')[1])
            } else {
                matched = self._startsWithZero(v)
            }

            if (!matched) {
                collector.push(v)
                return
            }

            var finalV = v;
            for(var j = 0; j < matched.length; j++) {
                var m = matched[j]
                if (m != '0s') {
                    finalV = finalV.replace(m, '0')
                }
            }

            collector.push(finalV)
        })

        rule.fixedValue = collector.join(' ').replace(replacer_unit, ', ')
    }

    this._startsWithZero = function(self, value) {
        var matched = value.match(pattern_unit)
        return matched
    }

    this.__doc__ = {
        "summary":"删除0后面的单位",
        "desc":"0后面的单位可以删除，以实现更好的压缩。比如 <code>0px ==> 0</code> ，<code>0em ==> 0</code> 等，\
            但是<code>transition: 0s</code>的<code>s</code>不能省略"
    }
})