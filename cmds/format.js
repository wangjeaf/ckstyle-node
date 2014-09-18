var colors = require('colors')
var o = require('./helper/options')
var slice = Array.prototype.slice
var loadFileConfig = require('./helper/ConfigFileParser').loadFileConfig
var formatter = require('../ckstyle/doCssFormat')
var fs = require('fs')

exports.meta = {
  name: 'format',
  options: [
    o.config,
    o.recursive, 
    o.print, 
    o.formatextension,
    o.nobak
  ],
  description: '自动简单格式化CSS'
}

exports.handle = function() {
  var args = slice.call(arguments, -1)[0]
  var config = loadFileConfig(exports.meta.name, args.config)
  config.extend(args)

  var files = slice.call(arguments, 0, -1)
  files.forEach(function(f) {
    formatter.format(f, config)
  })
}
