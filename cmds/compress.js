var colors = require('colors')
var o = require('./helper/options')

exports.meta = {
  name: 'compress',
  options: [
    o.config,
    o.recursive, 
    o.print, 
    o.include, 
    o.exclude, 
    o.minextension, 
    o.ignores, 
    o.safe, 
    o.combine, 
    o.browsers,
    o.nobak
  ],
  description: '压缩CSS文件'
}

exports.handle = function() {
  console.log(arguments);
  console.log('[ckstyle]'.green + ' welcome to demo command'.red + Array.prototype.slice.call(arguments));
}
