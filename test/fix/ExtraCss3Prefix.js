var doFix = require('./helper').doFix

exports.doTest = function() {
    _not_listed()
    _both_not_listed()
}

function _both_not_listed() {
    css = heredoc(function() {
/*html {
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  -o-hyphens: auto;
  hyphens: auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}*/
});

    expectedFixed = heredoc(function() { /*html {
    -webkit-hyphens: auto;
       -moz-hyphens: auto;
        -ms-hyphens: auto;
         -o-hyphens: auto;
            hyphens: auto;
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
}*/});

    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg.trim(), expectedFixed.trim(), 'both css3 prop not listed is ok')
}

function _not_listed() {
    css = heredoc(function() { /*.html {
        -moz-box-sizing: 1px;
        -webkit-box-sizing: 1px;
        box-sizing: 1px;
    }*/});

    expectedFixed = heredoc(function() { /*.html {
    -webkit-box-sizing: 1px;
       -moz-box-sizing: 1px;
            box-sizing: 1px;
}*/});

    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(msg.trim(), expectedFixed.trim(), 'css3 prefix box-sizing is ok')
}