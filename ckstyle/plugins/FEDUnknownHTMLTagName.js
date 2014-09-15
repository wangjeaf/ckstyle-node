var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleSetChecker = base.RuleSetChecker
var helper = require('./helper');

module.exports = global.FEDUnknownHTMLTagName = new Class(RuleSetChecker, function() {
    this.__init__ = function(self) {
        self.id = 'unknown-html-tag'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg_rough = 'unknown html tag "%s" found in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, ruleSet, config) {
        var selector = ruleSet.selector.toLowerCase()
        if (selector.indexOf('@media') != -1)
            return true
        if (selector.indexOf('@-moz-document') != -1)
            return true
        var selectors = selector.split(',')
        for(var i = 0; i < selectors.length; i++) {
            var s = selectors[i];
            var splited = s.split(' ');
            for(var j = 0; j < splited.length; j++) {
                var r = splited[j];
                r = r.trim()
                if (!r) {
                    continue;
                }
                if (r.indexOf('::') != -1) {
                    // p::selection
                    tag = r.split('::')[0].split('.')[0].split('#')[0].trim()
                } else {
                    // abcd:hover
                    // abcd.class-name:hover
                    // abcd#class-name:hover
                    tag = r.split(':')[0].split('.')[0].split('#')[0].trim()
                }
                // .test > .inner
                if (tag == '' || tag == '>' || tag == '*' || tag == '+')
                    continue

                // #id
                if (tag.indexOf('#') != -1)
                    continue

                // input[type=button]
                if (tag.indexOf('[') != -1)
                    tag = tag.split('[')[0].trim()

                // *+html
                if (tag.indexOf('*+') == 0)
                    tag = tag.slice(2)

                // *html
                else if (tag.indexOf('*') == 0)
                    tag = tag.slice(1)
                
                if (!helper.isHTMLTag(tag)) {
                    self.errorMsg = self.errorMsg_rough.replace('%s', tag)
                    return false
                }
            }
        }
        return true 
    }

    this.fix = function(self, ruleSet, config) {
        return;
    }

    this.__doc__ = {
        "summary":"错误的HTML Tag",
        "desc":"如果您输入了错误的HTML Tag，本工具也会给出相应的提示"
    }
})