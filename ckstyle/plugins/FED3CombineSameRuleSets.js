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
        self.id = 'combine-same-rulesets'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_empty = '"%s" contains the same rules in "${file}"'
        self.errorMsg = ''
        self.order = 1
    }

    // can be checked correctly only after reorder/fix/compress, so do not check
    this.check = function(self, styleSheet, config) {
        var ruleSets = styleSheet.getRuleSets()
        var mapping = self.rulesetMapper(ruleSets, ALL)
        var length = helper.len(mapping)

        var errors = {}
        for(var i = 0; i < length; i++) {
            for(var j = i + 1; j < length; j++) {
                if (mapping[i][1] == mapping[j][1]) {
                    var cssText = mapping[i][1]
                    if (!(cssText in errors)) {
                        errors[cssText] = []
                        errors[cssText].push(mapping[i][0])
                        errors[cssText].push(mapping[j][0])
                    } else if (errors[cssText].indexOf(mapping[j][0]) == -1) {
                        errors[cssText].push(mapping[j][0])
                    }
                    //errors.append(self.errorMsg_empty % (mapping[i][0], mapping[j][0]))
                }
            }
        }
        if (helper.len(Object.keys(errors)) == 0)
            return true
        var msgs = [];
        for(var prop in errors) {
            var x = errors[prop];
            msgs.push(self.errorMsg_empty.replace('%s', x.join(', ')))
        }
        return msgs 
    }

    this.fix = function(self, styleSheet, config) {
        var browser = config._inner.curBrowser ? config._inner.curBrowser : ALL
        var ruleSets = styleSheet.getRuleSets()
        var mapping = self.rulesetMapper(ruleSets, browser)

        var length = helper.len(mapping)

        for (var i = 0; i < mapping.length; i++) {     
            if (mapping[i][0] == 'extra')
                continue

            var delta = 1;
            for (var j = i + 1; j < mapping.length; j++) {
                // 如果是safe模式，则只看紧贴在后面的
                if (config.safe && j != i + delta) {
                    continue
                }

                if (mapping[i][1] != mapping[j][1]) {
                    continue
                }

                // 合并则遵循如下策略：
                // 1、两者必须都与当前要求的浏览器兼容，即 browserI & browser != 0 and browserJ & browser != 0
                // 2、两者的浏览器兼容性必须完全一致，即 browserI ^ browserJ == 0
                // 第二点主要是因为有的属性合并以后，由于兼容性不同，受不兼容的selector影响，使本应该兼容的selector失效。
                var browserI = mapping[i][2]
                var browserJ = mapping[j][2]
                // mapping.debug && console.log(mapping[i][0], mapping[j][0], browserI, browserJ)
                if (!((browserI & browser) != 0 && 
                      (browserJ & browser) != 0 && 
                      (browserI ^ browserJ) == 0))
                    continue

                // bakcground-position is dangerous, position设置必须在background-image之后
                if (mapping[j][1].indexOf('background-position') != -1) {
                    continue
                }

                // make it different
                mapping[j][1] = helper.str(i) + helper.str(j)
                mapping[j][0] = 'extra'

                // extend target selector
                var target = styleSheet.getRuleSets()[i]
                var src = styleSheet.getRuleSets()[j]
                target.extendSelector(src)

                // remove rule set
                styleSheet.removeRuleSetByIndex(j)

                delta ++;
            }
        }
        // remember to clean after remove ruleset
        styleSheet.clean()
    }

    this.rulesetMapper = function(self, ruleSets, browser) {
        var mapping = []
        var counter = 0
        ruleSets.forEach(function(r) {
            if (r.extra) {
                // make it impossible to equal
                mapping.push(['extra', "do_not_combine_" + helper.str(counter)])
                counter = counter + 1
                return
            }
            mapping.push([r.selector, r.compressRules(browser), r.browser])
        });
        return mapping
    }

    this.__doc__ = {
        "summary":"合并两个完全相同的规则集",
        "desc":"如果两个规则集完全一样，则可以进行合并。<br>\
            需要指出的是：合并可能会带来功能上的问题。如果有问题，还请告知 wangjeaf@gmail.com~<br>\
            例如：<br>\
            <code>.a {width:100px}</code><br>\
            <code>.b {width:100px}</code><br>\
            <code>==></code><br>\
            <code>.a, .b {width:100px}</code><br>\
            <br>\
            <strong>安全模式下将不执行此规则</strong><br>\
        "
    }
})