var fs = require('fs')
var path = require('path')

var CleanCSS = require('clean-css')
var YUI = require('cssmin')
var CKStyle = require('../../index.js')

function compare(file, desc) {
    var content = fs.readFileSync(path.join(__dirname, './' + file), 'utf-8')
    var start = + new Date
    var yuied = YUI(content)
    var time = + new Date - start
    console.log((desc || file) + ' - YUI     : ' + yuied.length + ' in ' + time + 'ms')

    var start = + new Date
    var cleaned = new CleanCSS().minify(content)
    var time = + new Date - start
    console.log((desc || file) + ' - CleanCSS: ' + cleaned.length + ' in ' + time + 'ms');

    var start = + new Date
    var cked = CKStyle.compressStr(content)
    var time = + new Date - start
    console.log((desc || file) + ' - CKStyle : ' + cked.length  + ' in ' + time + 'ms')
}

// var cleaned = new CleanCSS().minify('a{color: black; font: white,black,white,black, Microsoft Yahei black, white ,sarif;}')
// console.log('CleanCSS: ' + cleaned);

// var a = '.a {font-family: "tahoma", "arial", "Microsoft Yahei"}'
// console.log(new CleanCSS().minify(a))

compare('test.css')
compare('normalize.css')
compare('bootstrap.css')
compare('animate.css')
compare('foundation.css')
