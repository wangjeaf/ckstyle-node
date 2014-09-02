var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

var pattern_color = /#([a-f0-9A-F]+)/g

module.exports = global.FEDHexColorShouldUpper = new Class(RuleChecker, function() {

    this.__init__ = function(self) {
        self.id = 'hexadecimal-color'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_length = 'wrong color length(should be 3 or 6) in "${selector}"'
        self.errorMsg_replace = 'replace "#%s" with "#%s" in "${selector}"'
        self.errorMsg_upper = 'color should in upper case in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        var value = rule.value
        if (value.indexOf('#') == -1)
            return true

        var found = self._findColor(rule.value)
        for(var i = 0; i < found.length; i++) {
            var f = found[i];
            var flag = self._checkEach(f)
            if (!flag)
                return false
        }
        return true
    }

    this.fix = function(self, rule, config) {
        var value = rule.fixedValue
        if (value.indexOf('#') == -1) 
            return

        var hasImportant = rule.fixedValue.indexOf('important') != -1
        var found = self._findColor(rule.fixedValue)
        for(var i = 0; i < found.length; i++) {
            var f = found[i]
            f = f.trim()
            self._fixEach(rule, f, hasImportant)
        }
    }

    this._checkEach = function(self, found) {
        if (!found)
            return true

        if (self._isLower(found)) {
            self.errorMsg = self.errorMsg_upper
            return false
        }

        if (helper.len(found) == 3)
            return true

        if (self._wrongLength(found)) {
            self.errorMsg = self.errorMsg_length
            return false
        }

        if (self._isDuplicate(found)) {
            self.errorMsg = self.errorMsg_replace.replace('%s', found).replace('%s', found[0]+found[2]+found[4])
            return false
        }
        
        return true
    }

    this._fixEach = function(self, rule, found, hasImportant) {
        if (self._isLower(found)) {
            rule.fixedValue = rule.fixedValue.replace('#' + found, '#' + found.toUpperCase())
            found = found.toUpperCase()
        }

        if (helper.len(found) == 3)
            return

        if (!hasImportant && self._wrongLength(found)) {
            var finalColor = helper.len(found) > 6 ? found.slice(0, 6) : (found + helper.times('F', 6 - helper.len(found)))
            rule.fixedValue = rule.fixedValue.replace('#' + found, '#' + finalColor)
            found = finalColor
        }
        if (self._isDuplicate(found)) {
            rule.fixedValue = rule.fixedValue.replace('#' + found, '#' + found[0] + found[2] + found[4])
        }
    }

    this._wrongLength = function(self, found) {
        return helper.len(found) != 3 && helper.len(found) != 6
    }

    this._isLower = function(self, found) {
        return found && found != found.toUpperCase()
    }

    this._isDuplicate = function(self, found) {
        return found[0] == found[1] && found[2] == found[3] && found[4] == found[5]
    }

    this._findColor = function(self, value) {
        var splited = value.split(' ')
        var found = []
        for(var i = 0; i < splited.length; i++) {
            var x = splited[i];
            x = x.trim()
            matcher = x.match(pattern_color)
            if (matcher) {
                found = found.concat(matcher)
            }
            //if x.startswith('#'):
            //    found.append(x.split('!important')[0][1:].split(',')[0].split(')')[0])
            //elif x.find('(#') != -1:
            //    found.append(x.split('(#')[1].split('!important')[0].split(',')[0].split(')')[0])
        }
        for(var i = 0; i < found.length; i++) {
            found[i] = found[i].replace('#', '')
        }
        return found
    }

    this.__doc__ = {
        "summary":"16进制颜色大写&缩写",
        "desc":"<p>浏览器会先将小写的颜色值转换成大写，所以写成大写格式可以省略这部分的开销，并且尽量省略，例如：\
            </br><code>color:#ffffff; </code><br/><code>==></code><br/><code>color:#FFF;</code></p>"
    }
})