var styler = require('./ckstyler');

var CssChecker = styler.CssChecker;
var checker = new CssChecker('.html {\
              -moz-box-sizing: 1px;\
          -webkit-box-sizing: 1px;\
                   box-sizing: 1px;\
       }');
checker.prepare() // load plugins, do css parser;

checker.doCheck();
var errors = checker.getErrors()
//console.log(errors);

var fixed = checker.doFix();
console.log(fixed);

var compressed = checker.doCompress();
//console.log(compressed);