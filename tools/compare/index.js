var fs = require('fs')
var path = require('path')

var CleanCSS = require('clean-css')
var YUI = require('cssmin')
var CKStyle = require('../../index.js')

var content = fs.readFileSync(path.join(__dirname, './test.css'), 'utf-8')

var yuied = YUI(content)
console.log('YUI     : ' + yuied.length)

var cleaned = new CleanCSS().minify(content)
console.log('CleanCSS: ' + cleaned.length);

var cked = CKStyle.compressStr(content)
console.log('CKStyle : ' + cked.length)


var cleaned = new CleanCSS().minify('a{color: black; font: white,black,white,black, Microsoft Yahei black, white ,sarif;}')
console.log('CleanCSS: ' + cleaned);