var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleSetChecker = base.RuleSetChecker;
var helper = require('./helper');

module.exports = global.FEDHighPerformanceSelector = new Class(RuleSetChecker, function () {

    this.__init__ = function (self) {
        self.id = 'high-perf-selector'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg_shorter = 'please shorter the selector "${selector}"'
        self.errorMsg_no1 = 'do not use low performance selector ">" in "${selector}"'
        self.errorMsg_lessTag = 'use less tag in "${selector}"'
        self.errorMsg_id = 'should not put "HTMLtag" and "#id" together in "${selector}"'
        self.errorMsg_class = 'should not put "HTMLtag" and ".class" together in "${selector}"'
        self.errorMsg_reg = 'should not use ~=,^=,|=,$=,*= in selector of "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, ruleSet, config) {
        var selectors = ruleSet.selector.replace(/\s\s/g, '').split(',')
        for(var i = 0; i < selectors.length; i++) {
            var s = selectors[i];
            if (s.indexOf('@media') != -1)
                continue

            if (s.indexOf('=') != -1) {
                if (s.indexOf('~=') != -1 || 
                    s.indexOf('^=') != -1 || 
                    s.indexOf('|=') != -1 || 
                    s.indexOf('$=') != -1 || 
                    s.indexOf('*=') != -1) {
                    self.errorMsg = self.errorMsg_reg
                    return false
                }
            }

            var splited = s.split(' ')
            if (helper.len(splited) > 5) {
                self.errorMsg = self.errorMsg_shorter
                return false
            }
            var counter = 0
            for(var j = 0; j < splited.length; j++) {
                var p = splited[j];
                if (p == '>') {
                    self.errorMsg = self.errorMsg_no1
                    return false
                }

                var innerSplit = p.split('#')
                if (helper.len(innerSplit) == 2 && helper.isHTMLTag(innerSplit[0])) {
                    self.errorMsg = self.errorMsg_id
                    return false
                }

                var innerSplit = p.split('.')
                if (helper.len(innerSplit) == 2 && helper.isHTMLTag(innerSplit[0])) {
                    self.errorMsg = self.errorMsg_class
                    return false
                }

                if (helper.isHTMLTag(p)) 
                    counter = counter + 1
            }
            if (counter > 1) {
                self.errorMsg = self.errorMsg_lessTag
                return false
            }
        }

        var noSpace = ruleSet.selector.replace(/\s/g, '')
        if (noSpace.indexOf('ulli') != -1 || 
            noSpace.indexOf('olli') != -1 || 
            noSpace.indexOf('dldt') != -1 || 
            noSpace.indexOf('dldd') != -1) {
            self.errorMsg = self.errorMsg_lessTag
            return false
        }
        return true
    }

    this.__doc__ = {
        "summary":"针对低性能的选择器的检查",
        "desc":"低性能选择器，害人害己还集体，本工具收集了一些低性能选择器的情形，具体请参见：<br>\
            <code>FEDHighPerformanceSelector.py</code>中的相关内容"
    }
})