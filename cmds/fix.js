var colors = require('colors')
var o = require('./helper/options')

exports.meta = {
  name: 'fix',
  options: [
    o.config,
    o.recursive, 
    o.print, 
    o.include, 
    o.exclude, 
    o.ignores, 
    o.safe, 
    o.fixextension,
    o.nobak
  ],
  description: '自动修复和美化CSS'
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
