var colors = require('colors')
var o = require('./helper/options')
var slice = Array.prototype.slice
var loadFileConfig = require('./helper/ConfigFileParser').loadFileConfig
var checker = require('../ckstyle/doCssCheck')
var fs = require('fs')

exports.meta = {
  name: 'check',
  options: [
    o.config,
    o.error, 
    o.recursive, 
    // o.print, 
    o.output,
    o.include, 
    o.exclude, 
    // o.ckextension, 
    o.ignores, 
    o.tabs,
    o.json
  ],
  description: '检查CSS文件'
}

exports.handle = function() {
  var args = slice.call(arguments, -1)[0]
  var config = loadFileConfig(exports.meta.name, args.config)
  config.extend(args)

  var files = slice.call(arguments, 0, -1)
  files.forEach(function(f) {
    checker.check(f, config)
  })
}
