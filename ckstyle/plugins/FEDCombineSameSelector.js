var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var StyleSheetChecker = base.StyleSheetChecker
var helper = require('./helper')

var BinaryRule = require('../browsers/BinaryRule')
var ALL = BinaryRule.ALL
var STD = BinaryRule.STD

var doRuleSetDetect = require('../browsers/Hacks').doRuleSetDetect
module.exports = global.FEDCombineSameRuleSets = new Class(StyleSheetChecker, function() {
    
    this.__init__ = function(self) {
        self.id = 'combine-same-selector'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_empty = '"%s" contains the same selector in "${file}"'
        self.errorMsg = ''
    }

    this.check = function(self, styleSheet, config) {
        return true
    }

    this.fix = function(self, styleSheet, config) {
        var ruleSets = styleSheet.getRuleSets()
        var mapper = {}
        var counter = 0
        ruleSets.forEach(function(ruleset) {
            if (ruleset.extra) {
                return
            }
            var fixedSelector = ruleset.fixedSelector
            mapper[fixedSelector] = mapper[fixedSelector] || []
            mapper[fixedSelector].push({
                counter: counter++,
                ruleset: ruleset
            });
        })

        
        for(var prop in mapper) {
            var sameSelectorRuleSets = mapper[prop]
            if (sameSelectorRuleSets.length > 1) {
                self._combine(sameSelectorRuleSets, config)
            }
        }
    }

    this._combine = function(self, rulesets, config) {
        if (!config.safe) {
            var first = rulesets[0].ruleset;
            for(var i = 1; i < rulesets.length; i++) {
                first.extendRules(rulesets[i].ruleset)
                styleSheet.removeRuleSet(rulesets[i].ruleset)
            }
        } else {
            var i = 0;
            while(i < rulesets.length - 1) {
                var a = rulesets[i];
                var delta = 1;
                for(var j = i + 1; j < rulesets.length; j++) {
                    if (rulesets[j].counter - a.counter == delta) {
                        i ++;
                        delta ++;
                        a.ruleset.extendRules(rulesets[j].ruleset)
                        styleSheet.removeRuleSet(rulesets[j].ruleset)
                    }
                }
                i ++
            }
        }
    }

    this.__doc__ = {
        "summary":"合并两个相同的selector",
        "desc":"两个selector一样，属性不一样的，可以尝试合并<br>\
            需要指出的是：合并可能会带来功能上的问题。如果有问题，还请告知 wangjeaf@gmail.com~<br>\
            例如：<br>\
            <code>.a {width:100px}</code><br>\
            <code>.a {height:200px}</code><br>\
            <code>==></code><br>\
            <code>.a {width:100px; height: 200px;}</code><br>\
            <br>\
        "
    }
})