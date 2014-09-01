var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;
var isCss3PrefixProp = require('./helper').isCss3PrefixProp;

module.exports = global.FEDHackAttributeInCorrectWay = new Class(RuleChecker, function () {
		this.__init__ = function (self) {
			self.id = 'hack-prop';
			self.errorLevel = ERROR_LEVEL.ERROR;
			self.errorMsg = '"${name}" is not in correct hacking way in "${selector}"';
		}
		this.check = function (self, rule, config) {
			if (rule.value.indexOf('\\0') != -1)
				return false;

			stripped = rule.roughName.trim();
			if (rule.name == stripped.toLowerCase())
				return true;

			if (isCss3PrefixProp(rule.name))
				return true;

			if (!this.startswith(stripped, '_') && !this.startswith(stripped, '*') && this.startswith(stripped, '+'))
				return false;

			return true

		}
		this.startWith = function (self, v, str) {

			if (str[0] == '*' || str[0] == '+') {
				str = '\\' + str;
			}
			//console.log(v)

			var reg = new RegExp("^" + str);
			return reg.test(v.replace(/\'"/g, ''));
		}

		this.__doc__ = {
			"summary" : "hack属性时的检查",
			"desc" : "必须使用正确的 hack 方式， 比如 <code>_ * +</code> 等，其他的属性前缀一律不允许"
		}
	})