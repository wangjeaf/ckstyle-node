var doCssFileCompress = require('./helper').doCssFileCompress

exports.doTest = function() {
    _base()
    _do_border()
}

function _base() {
    msg = doCssFileCompress('_test.css')
    equal(msg, '@import (url-here);.test,.test2,.test3,.test4,.test5{_width:100px;*height:100px}.test6{display:none;_width:100px;*height:100px}', 'totally compressed')

    msg = doCssFileCompress('_test_different_order.css')
    equal(msg, '.test1,.test2,.test3,.test4,.test5{*display:none;_display:inline-block;width:100px;height:200px;border:1px solid #FFF}', 'totally compressed')

    msg = doCssFileCompress('_with_margin.css')
    equal(msg, '.test,.test2,.test3,.test4,.test5{_width:100px;*height:100px;margin:20px 10px 10px}.test6{display:none;_width:100px;*height:100px}', 'margin compress ok')

    msg = doCssFileCompress('_just_margin.css')
    equal(msg, '.test,.test2,.test3,.test4{margin:20px 10px 10px}', 'just margin compress ok')

    msg = doCssFileCompress('_with_padding.css')
    equal(msg, '.test,.test2,.test3,.test4,.test5{_width:100px;*height:100px;padding:20px 10px 10px}.test6{display:none;_width:100px;*height:100px}', 'padding compress ok')

    msg = doCssFileCompress('_just_padding.css')
    equal(msg, '.test,.test2,.test3,.test4{padding:20px 10px 10px}', 'just padding compress ok')
}

function _do_border() {
    msg = doCssFileCompress('_just_border.css')
    equal(msg, '.border-1,.border-2,.border-3,.border-4{border:medium double red}.border-5{border:1px solid rgba(255,255,255,.1)}.border-6{border:1px solid red}', 'just border compress ok')

    msg = doCssFileCompress('_border_special.css')
    equal(msg, '.a{border:1px solid red}.b{border:1px red}.c,.d{border:1px solid}.e{border-style:solid;border-color:red}.f{border-color:red}.g{border:1px solid;*border-color:red}.h{border:2px}.i{border:11px}', 'just border compress ok')
}