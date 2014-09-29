var Checker = require('../ckstyle/ckstyler').CssChecker;
var CommandArgs = require('../ckstyle/command/args').CommandArgs;
var config = new CommandArgs()

var autoprefixer = require('autoprefixer');

var css = 'a {\
    display: flex;\
}'

var prefixed     = autoprefixer.process(css).css;

  var checker = new Checker(prefixed, {safe: false})

  checker.prepare();

  var res = checker.doFormat()
  console.log(res); 
