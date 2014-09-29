var Checker = require('../ckstyle/ckstyler').CssChecker;
var CommandArgs = require('../ckstyle/command/args').CommandArgs;
var config = new CommandArgs()

var less = require('less');

var css = '@base: #f938ab;\
\
.box-shadow(@style, @c) when (iscolor(@c)) {\
  -webkit-box-shadow: @style @c;\
  box-shadow:         @style @c;\
}\
.box-shadow(@style, @alpha: 50%) when (isnumber(@alpha)) {\
  .box-shadow(@style, rgba(0, 0, 0, @alpha));\
}\
.box {\
  color: saturate(@base, 5%);\
  border-color: lighten(@base, 30%);\
  div { .box-shadow(0 0 5px, 30%) }\
}'

less.render(css, function (e, css) {
    var checker = new Checker(css, {safe: false})

    checker.prepare();

    var res = checker.doFormat()
    console.log(res); 
});