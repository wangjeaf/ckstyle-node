var toString = Object.prototype.toString
var slice = [].slice

var Class = function(upper, init) {
    if (arguments.length == 1) {
        init = upper
        upper = Object
    }

    cls = function() {
        if (this.__init__) {
            var args = slice.call(arguments)
            this.__init__.apply(this, args)
        }
    }

    if (upper) {
        function F(){}
        F.prototype = upper.prototype
        cls.prototype = new F()
        cls.prototype.constructor = cls.prototype.me = cls
        cls.parent = cls.prototype.parent = upper
    }

    var obj = {}
    init.call(obj)

    function wrap(func) {
        if (toString.call(func) != '[object Function]') {
            return func
        }
        return function() {
            var args = slice.call(arguments)
            args.unshift(this)
            return func.apply(this, args)
        }
    }
    for(var prop in obj) {
        obj[prop] = wrap(obj[prop])
    }
    for(var prop in obj) {
        cls.prototype[prop] = obj[prop]
    }
    return cls
}

var Checker = new Class(function() {})

var RuleChecker = new Class(Checker, function() {})
RuleChecker.type = 'rule'

var RuleSetChecker = new Class(Checker, function() {})
RuleSetChecker.type = 'ruleset'

var StyleSheetChecker = new Class(Checker, function() {})
StyleSheetChecker.type = 'stylesheet'

var ExtraChecker = new Class(Checker, function() {})
ExtraChecker.type = 'extra'

var ERROR_LEVEL = {
    ERROR: 0,
    WARNING: 1,
    LOG: 2
}

function findInArray(array, value) {
    if (!array) {
        return false
    }
    return array.indexOf(value) != -1 || array.indexOf(value.trim()) != -1 
}

var toString = Object.prototype.toString
function isObject(obj) {
    return toString.call(obj) == '[object Object]'
}

function isFunction(obj) {
    return toString.call(obj) == '[object Function]'
}

exports.Class = Class
exports.ERROR_LEVEL = ERROR_LEVEL
exports.RuleChecker = RuleChecker
exports.RuleSetChecker = RuleSetChecker
exports.StyleSheetChecker = StyleSheetChecker
exports.ExtraChecker = ExtraChecker
exports.findInArray = findInArray
exports.isObject = isObject
exports.isFunction = isFunction