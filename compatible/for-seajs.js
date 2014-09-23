;;
// compatible for seajs
;;(function(global) {
    this.global = global;

    define('fs', {})
    define('path', {})
    define('colors', {})

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        };
    }
    
    if (!Object.keys) {
        Object.keys = function (object) {
            var keys = [];
            for (var name in object) {
                if (Object.prototype.hasOwnProperty.call(object, name)) {
                    keys.push(name);
                }
            }
            return keys;
        };
    }


    if (!Array.isArray) {
        Array.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]" ||
                   (obj instanceof Array);
        };
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach =  function(block, thisObject) {
            var len = this.length >>> 0;
            for (var i = 0; i < len; i++) {
                if (i in this) {
                    block.call(thisObject, this[i], i, this);
                }
            }
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (value /*, fromIndex */ ) {
            var length = this.length;
            var i = arguments[1] || 0;

            if (!length)     return -1;
            if (i >= length) return -1;
            if (i < 0)       i += length;

            for (; i < length; i++) {
                if (!Object.prototype.hasOwnProperty.call(this, i)) { continue }
                if (value === this[i]) return i;
            }
            return -1;
        };
    }

})(this);