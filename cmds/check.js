var colors = require('colors')
var o = require('./helper/options')

exports.meta = {
  name: 'check',
  options: [
    o.config,
    o.error, 
    o.recursive, 
    o.print, 
    o.include, 
    o.exclude, 
    o.ckextension, 
    o.ignores, 
    o.tabs
  ],
  description: '检查CSS文件'
}

exports.handle = function() {
  console.log(arguments[0])
  console.log('[ckstyle]'.green + ' welcome to demo command'.red + Array.prototype.slice.call(arguments));
}
