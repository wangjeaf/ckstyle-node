var colors = require('colors')
var o = require('./helper/options')
var slice = Array.prototype.slice
var loadFileConfig = require('./helper/ConfigFileParser').loadFileConfig
var fixer = require('../ckstyle/doCssFix')
var fs = require('fs')

exports.meta = {
  name: 'fix',
  options: [
    o.config,
    o.recursive, 
    // o.print, 
    o.output,
    o.include, 
    o.exclude, 
    o.ignores, 
    o.safe
    // o.fixextension,
    // o.nobak
  ],
  description: '自动修复和美化CSS'
}

exports.handle = function() {
  var args = slice.call(arguments, -1)[0]
  var config = loadFileConfig(exports.meta.name, args.config)
  config.extend(args)

  var files = slice.call(arguments, 0, -1)
  files.forEach(function(f) {
    fixer.fix(f, config)
  })
}
