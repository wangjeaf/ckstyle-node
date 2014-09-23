var colors = require('colors')
var o = require('./helper/options')
var slice = Array.prototype.slice
var loadFileConfig = require('./helper/ConfigFileParser').loadFileConfig
var compressor = require('../ckstyle/doCssCompress')
var fs = require('fs')

exports.meta = {
  name: 'compress',
  options: [
    o.config,
    o.recursive, 
    // o.print, 
    o.output,
    o.include, 
    o.exclude, 
    // o.minextension, 
    o.ignores, 
    o.safe, 
    // o.combine, 
    // o.nobak,
    o.browsers
  ],
  description: '压缩CSS文件'
}

exports.handle = function() {
  var args = slice.call(arguments, -1)[0]
  var config = loadFileConfig(exports.meta.name, args.config)
  config.extend(args)

  var files = slice.call(arguments, 0, -1)
  files.forEach(function(f) {
    compressor.compress(f, config)
  })
}
