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
  var CssChecker = require('../').CssChecker;
  var checker = new CssChecker('.a {width: 100px}');
  checker.prepare();
  var fixed = checker.doFix();
  console.log(fixed);

  var detector = require('../').Detector;
  var res = detector.doRuleDetect('*width', '100px');
  console.log(res.toString(2));
}
