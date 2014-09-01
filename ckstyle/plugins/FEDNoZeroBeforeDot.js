var base = require('../base')
	var ERROR_LEVEL = base.ERROR_LEVEL
	var Class = base.Class
	var RuleChecker = base.RuleChecker

	module.exports = global.FEDNoZeroBeforeDot = new Class(RuleChecker, function () {
		this.__init__ = function (self) {
			self.id = 'no-zero-before-dot';
			self.errorLevel = ERROR_LEVEL.ERROR;
			self.errorMsg = 'zero should be removed when meet 0.xxx in "${selector}"';
		}
		this.check = function (self, rule, config) {

			var value = rule.value;

			if (self._startsWithZeroDot(rule.value)) {
				return false
			}
			values = value.split(' ');
			for (v in values) {
				if(self._startsWithZeroDot(v.trim()))
				return false
			}

			return true
		}

		this.fix = function (self, rule, config) {
			var fixedValue = rule.fixedValue;
			var splittedValue = fixedValue.split(' ');
			for (var i = 0,l =splittedValue.length;i<l;i++) {
			
				if (self._startsWithZeroDot(splittedValue[i])){
						rule.fixedValue = fixedValue.replace(splittedValue[i], splittedValue[i].substring(1));
					}
					
			}
			
		}
		this._startsWithZeroDot = function (self, value) {
			return startWith(value, '0.')
		}

		function startWith(value, str) {
			var reg = new RegExp("^" + str);
			return reg.test(value.replace(/\'"/g,''));
		}

		this.__doc__ = {
			"summary" : "删除0.x前面的0",
			"desc" : "0.xxx 前面的 0 是可以删除的，以实现更好的压缩。例如<br><code>0.3px ==> .3px</code><br><br><code>rgba(0,0,0,0.3)<code><br><code>==></code><br><code>rgba(0,0,0,.3)</code>"
		}
	})