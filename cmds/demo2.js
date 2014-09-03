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
  var ckstyler = require('../ckstyle/ckstyler');
  var checker = new ckstyler.CssChecker('.a {width: 100px}');
  checker.prepare();
  var fixed = checker.doFix();
  console.log(fixed);
}
