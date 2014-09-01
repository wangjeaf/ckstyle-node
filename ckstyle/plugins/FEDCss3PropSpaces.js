var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var helper = require('./helper');

module.exports = global.FEDCss3PropSpaces = new Class(RuleChecker, function () {
    
    this.__init__ = function (self) {
        self.id = 'css3-prop-spaces'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_multi = 'css3 prop "${name}" should align to right in "${selector}"'
        self.errorMsg_single = 'should have 1(only) space before css3 prop "${name}" in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function (self, rule, config) {
        var name = rule.name
        // only for css3 props
        if (!helper.isCss3Prop(name))
            return true

        if (!helper.isCss3PrefixProp(name))
            return true
        
        if (!helper.doNotNeedPrefixNow(name)) {
            // if exists prefix, then should keep spaces
            if (!rule.getRuleSet().existRoughNames('-webkit-' + name + 
                ',-moz-' + name + 
                ',-ms-' + name + 
                ',-o-' + name)) {
                return true
            }
        }

        var roughName = rule.roughName

        if (!rule.getRuleSet().singleLineFlag) {
            // 12 = 4 + 8, 4 spaces, 8 for align
            if (helper.len(roughName.split(name)[0]) != 12) {
                self.errorMsg = self.errorMsg_multi
                return false
            }
        } else {
            if (helper.startswith(roughName, '  ') || !helper.startswith(roughName, ' ')) {
                self.errorMsg = self.errorMsg_single
                return false
            }
        }
        return true
    }

    this.fix = function(self, rule, config) {
        var name = rule.name
        // only for css3 props
        if (!helper.isCss3Prop(name))
            return

        if (!helper.isCss3PrefixProp(name))
            return

        if (!rule.getRuleSet().existRoughNames('-webkit-' + name + 
                ',-moz-' + name + 
                ',-ms-' + name + 
                ',-o-' + name)) {
            return
        }

        var fixedName = rule.fixedName
        var prefix = fixedName.split(name)[0]
        if (rule.selector.indexOf('%') != -1) {
            var remained = '-webkit-,-moz-,-ms-,-o-,'.replace(prefix + ',', '')
            var splited = remained.slice(0, -1).split(',')
            var collector = []
            splited.forEach(function(x) {
                collector.push(x + name);
            })
            var testString = collector.join(',')
            if (!rule.getRuleSet().existRoughNames(testString)) {
                return
            }
        }
        rule.fixedName = (config.fixToSingleLine ? '' : helper.times(' ', 8 - helper.len(prefix))) + fixedName
    }

    this.__doc__ = {
        "summary":"CSS3缩进相关检查",
        "desc":"CSS3属性的缩进，必须将属性名称的第一个字符对齐。即：<br>\
            <code>-webkit-transition:3s;</code>\
            <br><code>&nbsp;&nbsp;&nbsp;-moz-transition:3s;</code>\
            <br><code>&nbsp;&nbsp;&nbsp;&nbsp;-ms-transition:3s;</code>\
            <br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-o-transition:3s;</code>\
            <br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;transition:3s;</code>\
        "
    }
})