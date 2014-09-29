var compressStr = require('../index').compressStr
var formatStr = require('../index').formatStr
var fixStr = require('../index').fixStr

var css = '.a{ .b {box-sizing: border-box;}}'

var autoprefixer = require('autoprefixer')

var less = require('less')

function autoprefix(code, options) {
    code = autoprefixer.process(code, options).css
    return code
}

function lesser(code, options) {
    var parser = new(less.Parser)(options);
    parser.parse(code, function (err, tree) {
        var css = tree.toCSS({
            silent: options.silent,
            verbose: options.verbose,
            ieCompat: options.ieCompat,
            compress: options.compress,
            cleancss: options.cleancss,
            cleancssOptions: {},
            sourceMap: Boolean(options.sourceMap),
            sourceMapFilename: options.sourceMap,
            sourceMapURL: options.sourceMapURL,
            sourceMapOutputFilename: options.sourceMapOutputFilename,
            sourceMapBasepath: options.sourceMapBasepath,
            sourceMapRootpath: options.sourceMapRootpath || "",
            outputSourceFiles: options.outputSourceFiles,
            writeSourceMap: function() {},
            maxLineLen: options.maxLineLen,
            strictMath: options.strictMath,
            strictUnits: options.strictUnits,
            urlArgs: options.urlArgs
        });

        code = css;
    });

    return code;
}

var CKStyle = function(code, options) {
    this._cache = {
        plugins: {
            before: [],
            after: []
        },
        options: options,
        code: code,
        _compress: '',
        _fix: '',
        _check: '',
        _format: ''
    }
}

CKStyle.prototype = {
    plugin: function(plugin, options) {
        this._cache.plugins.before.push([plugin, options])
        return this
    },
    _before: function() {
        if (this._befored) {
            return
        }
        this._befored = 1
        var code = this._cache.code
        var options = this._cache.options
        var before = this._cache.plugins.before
        before.forEach(function(b) {
            code = b[0](code, b[1], options)
        })
        this.code = code
    },
    check: function(callback) {
        return this
    },
    compress: function(callback) {
        var options = this._cache.options
        this._before()
        var code = compressStr(this.code, options)
        this._compress = this._latest = code
        callback && callback(code)
        return this
    },
    format: function(callback) {
        var options = this._cache.options
        this._before()
        var code = formatStr(this.code, options)
        this._format = this._latest =  code
        callback && callback(code)
        return this
    },
    fix: function(callback) {
        var options = this._cache.options
        this._before()
        var code = fixStr(this.code, options)
        this._fix = this._latest =  code
        callback && callback(code)
        return this
    },
    output: function(type) {
        if (!type) {
            return this._latest
        }
        if (typeof type == 'function') {
            type(this._latest)
            return this._latest
        } else {
            return this['_' + type]
        }
    }
}

CKStyle.start = function(css, options) {
    return new CKStyle(css, options)
}

var res = CKStyle.start(css, {
    fileName: 'a.css'
})
    .plugin(lesser, {
    })
    .plugin(autoprefix, {
        a: 1
    })
    .fix(function(res) {
        console.log(res)
    })
    .compress()
    .output(function(res) {
        console.log(res)
    })
console.log(res)



