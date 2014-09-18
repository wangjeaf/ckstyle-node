var base = require('../base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var RuleChecker = base.RuleChecker;

module.exports = global.FEDNoAlphaImageLoader = new Class(RuleChecker, function () {

    this.__init__ = function (self) {
        self.id = 'no-alpha-image-loader';
        self.errorLevel = ERROR_LEVEL.WARNING;
        self.errorMsg = 'should not use AlphaImageLoader in "${selector}"';
    }
    
    this.check = function (self, rule, config) {
        if (rule.value.indexOf('AlphaImageLoader') != -1)
            return false;
        return true

    }

    this.__doc__ = {
        "summary" : "不要使用AlphaImageLoader",
        "desc" : "<code>AlphaImageLoader</code> 主要用于在IE6下显示半透明图片，\
            此举实际上费力不讨好，对IE的性能影响极大，为了更好地实现网页的 \
            <strong>渐进增强</strong> ，建议不要使用 <code>AlphaImageLoader</code>"
    }
})