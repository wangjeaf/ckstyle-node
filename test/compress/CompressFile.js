var doCssFileCompress = require('./helper').doCssFileCompress

exports.doTest = function() {
    _basic()
    _doc_demo()
    _one_line_file()
    _with_extra()
    _compress_with_hack_chars()
    _extra_statement()
    _expression()
}

function _basic() {
    msg = doCssFileCompress('_file.css')
    equal(msg, ".test{width:100px;height:200px;_z-index:111}@keyframes 'name'{10%{width:100px}}.another{*width:100px;background-color:#ABC;color:#DDD}", 'file compressed')
}

function _doc_demo() {
    msg = doCssFileCompress('_doc_demo.css')
    equal(msg, ".test1,.test2,.test3,.test4,.test5{*display:none;_display:inline-block;width:100px;height:200px;margin:20px 10px 10px;border:1px solid #FFF}", 'file compressed')
}

function _one_line_file() {
    msg = doCssFileCompress('_one_line_file.css')
    equal(msg, ".test{width:100px;height:200px;_z-index:111}@keyframes 'name'{10%{width:100px}}.another{*width:100px;background-color:#ABC;color:#DDD}", 'file compressed')
}

function _with_extra() {
    msg = doCssFileCompress('_with_extra.css')
    equal(msg, "@charset utf-8;@import url('xxxxx');@namespace lalala;.test{width:100px;height:200px;_z-index:111}@import url('xxx2');@import url('xxx3');", 'file compressed')
}

function _compress_with_hack_chars() {
    msg = doCssFileCompress('_compress_special_hack_chars.css')
    equal(msg, "li:nth-child(even){background:gray}* html li.even{background:gray}.test[^=aaa]{background:gray}.test1,.test2{width:100px}", 'file compressed')
}

function _extra_statement() {
    msg = doCssFileCompress('_extra_statement.css')
    // do not show @-css-compile content after compress
    equal(msg, "@charset utf-8;@import url(fdafdas/fdafdas.css);", 'extra statement compressed')
}

function _expression() {
    msg = doCssFileCompress('_expression.css')
    equal(msg, "*html .feed-comment textarea{behavior:expression(function(ele){ele.runtimeStyle.behavior='none';Expressions.pseudo.hover(ele,'textarea_hover')}(this))}", 'expression compressed')
}