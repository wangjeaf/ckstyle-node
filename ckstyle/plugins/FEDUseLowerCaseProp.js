var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker
var helper = require('./helper');

module.exports = global.FEDUseLowerCaseProp = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'lowercase-prop'
        self.errorLevel = ERROR_LEVEL.WARNING
        self.errorMsg_name = '"${name}" should use lower case, in "${selector}"'
        self.errorMsg_value = 'value of "${name}" should use lower case, in "${selector}"'
        self.errorMsg = ''
    }

    this.check = function(self, rule, config) {
        var value = rule.value
        var name = rule.strippedName

        // give it to FED16ColorShouldUpper.py
        if (name == 'color')
            return true

        if (value.indexOf('expression') != -1)
            return true

        if (name.toLowerCase() != name) {
            self.errorMsg = self.errorMsg_name
            return false
        }

        if (value.indexOf('#') != -1)
            return true

        if (name != 'font' && name != 'font-family' && value != value.toLowerCase() && value.indexOf('#') == -1) {
            self.errorMsg = self.errorMsg_value
            return false
        }

        if (name == 'font-family')
            return true

        if (name == 'font') {
            if (value.indexOf(',') != -1) {
                // font: italic bold 12px/30px 'Courier New', Georgia, serif;
                var other = value.split(',')[0].split('"')[0].split("'")[0].split(' ').slice(0, -1).join(' ');
                if (other != other.toLowerCase()) {
                    self.errorMsg = self.errorMsg_value
                    return false
                }
            }
            return true
        }

        if (value.toLowerCase() != value) {
            self.errorMsg = self.errorMsg_value
            return false
        }

        return true 
    }

    this.fix = function(self, rule, config) {
        return;
    }

    this.__doc__ = {
        "summary":"属性名称应该用小写",
        "desc":"所有的CSS属性名称一律小写，例如 <code>width</code> ，大写的方式是不正确的，\
            例如： <code>WIDTH:100px;</code>"
    }
})