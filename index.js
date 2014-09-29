var commander = require('commander')
var join = require('path').join
var path = require('path')
var rootDir = __dirname
var fs = require('fs')
var colors = require('colors')

var cmdPath = function(file) {
  return join(rootDir, 'cmds', file)
}

function loadCommands() {
  var commandNames = []
  fs.readdirSync(path.join(rootDir, 'cmds')).forEach(function(filename) {
    if (path.extname(filename) != '.js') {
      return
    }
    var cmdMeta = require(cmdPath(filename))
    var meta = cmdMeta.meta
    var handle = cmdMeta.handle
    if (!meta || !handle) {
      console.error(filename + ' 文件，不符合ckstyle命令文件规范')
      console.error('每一个命令必须包含 meta(命令描述) 和 handle(命令处理函数) 两个部分')
      return
    }
    var cmd = commander.command(meta.name)
    commandNames.push(meta.name)
    cmd.description(meta.description)
    if (meta.options) {
      meta.options.forEach(function(op) {
        cmd.option(op.flags, op.description, op.defaultValue)
      })
    }
    cmd.action(handle)
  })
  commander.usage(commandNames.join('/') + ' [options]')
}

exports.command = function(args) {
  loadCommands()

  commander.parse(args)

  var rawArgs = commander.rawArgs
  // rawArgs示例：[ 'node', '/usr/local/bin/ckstyle', 'demo' ]

  if (rawArgs.length == 2) {
    commander.help()
  } else if (rawArgs.length > 2) {
    var name = rawArgs[2]

    var found = commander.commands.some(function(cmd) {
      return cmd._name == name
    })

    if (!found) {
      console.log('[CKStyle] Sorry, ckstyle can not find sub command: '.red + name.red)
      return
    }
  }
}

exports.CSSParser = require('./ckstyle/parser/index').CSSParser
exports.CssChecker = require('./ckstyle/ckstyler').CssChecker
exports.Detector = require('./ckstyle/browsers/Hacks')

var compressStr = require('./ckstyle/doCssCompress').compressStr
var fixStr = require('./ckstyle/doCssFix').fixStr
var formatStr = require('./ckstyle/doCssFormat').formatStr

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
        this._cache.plugins.before.push([plugin, options || {}])
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
        var code = CKStyle.compress(this.code, options)
        this._compress = this._latest = code
        callback && callback(code)
        return this
    },
    format: function(callback) {
        var options = this._cache.options
        this._before()
        var code = CKStyle.format(this.code, options)
        this._format = this._latest =  code
        callback && callback(code)
        return this
    },
    fix: function(callback) {
        var options = this._cache.options
        this._before()
        var code = CKStyle.fix(this.code, options)
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

CKStyle.parse = function(code, options) {
  options = options || {}
  var parser = new exports.CSSParser(code, options.fileName, options);
  parser.doParse(options);
  return parser;
}

CKStyle.compress = compressStr
CKStyle.format = formatStr
CKStyle.fix = fixStr

exports.CKStyle = CKStyle
