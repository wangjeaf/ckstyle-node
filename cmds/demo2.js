var colors = require('colors')

exports.meta = {
  name: 'demo2',
  options: [{
    flags: "-s, --save",
    description: 'option示例',
    defaultValue: false
  }],
  description: '示例命令2'
}

exports.handle = function() {
  console.log(arguments);
  console.log('[ckstyle]'.green + ' welcome to demo2 command'.red);
}
