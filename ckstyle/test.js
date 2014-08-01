var styler = require('./ckstyler');

var CssChecker = styler.CssChecker;
var checker = new CssChecker('.a {width: 100px; font-family: "sanrif"} .b, .c {width: 200px;} .a.b,.c.d{width:200px; color: black; background-color:red;}');
checker.prepare() // load plugins, do css parser;

checker.doCheck();
var errors = checker.getErrors()
console.log(errors);

var fixed = checker.doFix();
console.log(fixed);

var compressed = checker.doCompress();
console.log(compressed);