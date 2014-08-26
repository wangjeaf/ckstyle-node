var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var RuleChecker = base.RuleChecker

module.exports = global.FEDZIndexShouldInRange = new Class(RuleChecker, function() {
    this.__init__ = function(self) {
        self.id = 'z-index-in-range'
        self.errorLevel = ERROR_LEVEL.ERROR
        self.errorMsg = 'value of "z-index" is not correct in "${selector}"'
    }

    this.check = function(self, rule, config) {
        if (rule.name !== 'z-index')
            return true

        var zIndex = Number(rule.value.replace(/['"]/g,''));
		var a = rule.value;
		if(isNaN(zIndex)){
			return false
		}
		
        if (zIndex < -1||zIndex > 2100){
			return false
		}

        return true
    }

    this.__doc__ = {
        "summary":"z-index取值应符合范围要求",
        "desc":"<code>z-index</code> 的取值如果混乱，则会造成层之间的相互覆盖，因此 <code>z-index</code> 取值必须符合一定的范围要求"
    }
})