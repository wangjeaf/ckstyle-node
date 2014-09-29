var postcss = require("postcss");

var css = '.a {width: 100} '

var parsed = postcss.parse(css);
console.log(parsed.toString())