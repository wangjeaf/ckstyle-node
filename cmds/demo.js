var colors = require('colors')

exports.meta = {
  name: 'demo',
  options: [{
    flags: "-s, --save",
    description: 'option示例',
    defaultValue: false
  }],
  description: '示例命令'
}

exports.handle = function() {
  console.log(arguments);
  console.log('[ckstyle]'.green + ' welcome to demo command'.red + Array.prototype.slice.call(arguments));
}
