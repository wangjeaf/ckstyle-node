var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var helper = require('./helper')

module.exports = global.FEDMultiLineSpaces = new Class(RuleChecker, function () {

    this.__init__ = function (self) {
        self.id = 'multi-line-space'
        self.errorLevel = ERROR_LEVEL.LOG
        self.errorMsg_name_pre = 'should have 4 spaces before "${name}" in "${selector}"'
        self.errorMsg_name_after = 'should not have "space" after "${name}" in "${selector}"'
        self.errorMsg_value_pre = 'should have (only) one "space" before value of "${name}" in "${selector}"'
        self.errorMsg = ''
    }
    
    this.check = function(self, rule, config) {
        var singleLine = rule.getRuleSet().getSingleLineFlag()
        if (singleLine)
            return true
        
        var prefix = '    '
        var name = rule.roughName
        var value = rule.roughValue
        var stripped = rule.roughName.trim()

        // leave special css3 props for FEDCss3AttrChecker
        if (helper.isCss3PrefixProp(rule.name)) {
            if (name.slice(-1) == ' ') {
                self.errorMsg = self.errorMsg_name_after
                return false
            }

            if (!(value.indexOf(' ') == 0) || value.indexOf('  ') == 0) {
                self.errorMsg = self.errorMsg_value_pre
                return false
            }

            return true
        }

        if (name.indexOf('\t') != -1)
            name = name.replace(/\t/g, prefix)

        if (!(name.indexOf(prefix) == 0)) {
            self.errorMsg = self.errorMsg_name_pre
            return false
        }
        if (name.indexOf('     ') == 0) {
            self.errorMsg = self.errorMsg_name_pre
            return false
        }
        if (name.slice(-1) == ' ') {
            self.errorMsg = self.errorMsg_name_after
            return false
        }

        if (!(value.indexOf(' ') == 0) || value.indexOf('  ') == 0) {
            self.errorMsg = self.errorMsg_value_pre
            return false
        }

        return true 
    }

    this.__doc__ = {
        "summary":"CSS多行风格的空格检查",
        "desc":"多行风格下，CSS的空格检查包括：\
            <ol>\
                <li>选择器的空格</li>\
                <li>属性的空格</li>\
                <li>结尾}的空格</li>\
            </ol>\
            具体请参见人人相关的CSS规范"
    }
})
