var doCssCompress = require('./helper').doCssCompress

exports.doTest = function() {
    _go()
}

function _go() {
    msg = doCssCompress('@media print{/* Hide the cursor when printing */.CodeMirror div.CodeMirror-cursor{visibility:hidden}}')
    equal(msg, '@media print{.CodeMirror div.CodeMirror-cursor{visibility:hidden}}', 'nested statement compress is ok')
}