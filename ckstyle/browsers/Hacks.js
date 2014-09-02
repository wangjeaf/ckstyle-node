var B = require('./BinaryRule')

var IE6 = B.IE6
var IE7 = B.IE7
var IE8 = B.IE8
var IE9PLUS = B.IE9PLUS
var NONE = B.NONE
var NONEIE = B.NONEIE
var NOIE678 = B.NOIE678
var NOIE6 = B.NOIE6
var NOIE67 = B.NOIE67
var ALLIE = B.ALLIE
var WEBKIT = B.WEBKIT
var FIREFOX = B.FIREFOX
var OPERA = B.OPERA
var CHROME = B.CHROME
var SAFARI = B.SAFARI
var STD = B.STD
// http://www.swordair.com/tools/css-hack-table/
// big table

var RULE_HACKS = [
    [new RegExp('^_'),                     1,  IE6],
    [new RegExp('^\\+'),                    1,  IE6 | IE7],
    [new RegExp('^\\*'),                    1,  IE6 | IE7],
    [new RegExp('.*\\9'),                  2,  ALLIE],
    [new RegExp('.*\\0/'),                 2,  IE8],
    [new RegExp('.*\\0'),                  2,  IE8 | IE9PLUS],
    [new RegExp('zoom|behavior|filter'),   1,  ALLIE],
    [new RegExp('.*(m|M)icrosoft'),        2,  ALLIE],
    [new RegExp('^expression'),            2,  ALLIE],
    [new RegExp('^\-webkit\-'),            1,  WEBKIT],
    [new RegExp('^\-webkit\-'),            2,  WEBKIT],
    [new RegExp('^\-moz\-'),               1,  FIREFOX],
    [new RegExp('^\-moz\-'),               2,  FIREFOX],
    [new RegExp('^\-ms\-'),                1,  IE9PLUS],
    [new RegExp('^\-ms\-'),                2,  IE9PLUS],
    [new RegExp('^\-khtml\-'),             1,  ALLIE],
    [new RegExp('^\-khtml\-'),             2,  ALLIE],
    [new RegExp('^\-o\-'),                 1,  OPERA],
    [new RegExp('^\-o\-'),                 2,  OPERA],

    // auto generated by script AUTO-GENERATOR-1 .
    [new RegExp('^alignment\-adjust'), 1, NONE],
    [new RegExp('^alignment\-baseline'), 1, NONE],
    [new RegExp('^animation'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-name'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-duration'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-timing\-function'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-delay'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-iteration\-count'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-direction'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^animation\-play\-state'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^appearance'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^backface\-visibility'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI],
    [new RegExp('^background\-clip'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^background\-origin'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^background\-size'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^baseline\-shift'), 1, NONE],
    [new RegExp('^bookmark\-label'), 1, NONE],
    [new RegExp('^bookmark\-level'), 1, NONE],
    [new RegExp('^bookmark\-target'), 1, NONE],
    [new RegExp('^border\-bottom\-left\-radius'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^border\-bottom\-right\-radius'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^border\-image'), 1, FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^border\-image\-outset'), 1, NONE],
    [new RegExp('^border\-image\-repeat'), 1, NONE],
    [new RegExp('^border\-image\-slice'), 1, NONE],
    [new RegExp('^border\-image\-source'), 1, NONE],
    [new RegExp('^border\-image\-width'), 1, NONE],
    [new RegExp('^border\-radius'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^border\-top\-left\-radius'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^border\-top\-right\-radius'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^box\-decoration\-break'), 1, NONE],
    [new RegExp('^box\-align'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^box\-direction'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^box\-flex'), 1, FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^box\-flex\-group'), 1, NONE],
    [new RegExp('^box\-lines'), 1, NONE],
    [new RegExp('^box\-ordinal\-group'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^box\-orient'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^box\-pack'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^box\-shadow'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^box\-sizing'), 1, IE8 | IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^color\-profile'), 1, NONE],
    [new RegExp('^column\-fill'), 1, NONE],
    [new RegExp('^column\-gap'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-rule'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-rule\-color'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-rule\-style'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-rule\-width'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-span'), 1, IE9PLUS | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-width'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^columns'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^column\-count'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^crop'), 1, NONE],
    [new RegExp('^dominant\-baseline'), 1, NONE],
    [new RegExp('^drop\-initial\-after\-adjust'), 1, NONE],
    [new RegExp('^drop\-initial\-after\-align'), 1, NONE],
    [new RegExp('^drop\-initial\-before\-adjust'), 1, NONE],
    [new RegExp('^drop\-initial\-before\-align'), 1, NONE],
    [new RegExp('^drop\-initial\-size'), 1, NONE],
    [new RegExp('^drop\-initial\-value'), 1, NONE],
    [new RegExp('^fit'), 1, NONE],
    [new RegExp('^fit\-position'), 1, NONE],
    [new RegExp('^float\-offset'), 1, NONE],
    [new RegExp('^font\-size\-adjust'), 1, FIREFOX],
    [new RegExp('^font\-stretch'), 1, NONE],
    [new RegExp('^grid\-columns'), 1, NONE],
    [new RegExp('^grid\-rows'), 1, NONE],
    [new RegExp('^hanging\-punctuation'), 1, NONE],
    [new RegExp('^hyphenate\-after'), 1, NONE],
    [new RegExp('^hyphenate\-before'), 1, NONE],
    [new RegExp('^hyphenate\-characters'), 1, NONE],
    [new RegExp('^hyphenate\-lines'), 1, NONE],
    [new RegExp('^hyphenate\-resource'), 1, NONE],
    [new RegExp('^hyphens'), 1, NONE],
    [new RegExp('^icon'), 1, NONE],
    [new RegExp('^image\-orientation'), 1, NONE],
    [new RegExp('^image\-resolution'), 1, NONE],
    [new RegExp('^inline\-box\-align'), 1, NONE],
    [new RegExp('^line\-stacking'), 1, NONE],
    [new RegExp('^line\-stacking\-ruby'), 1, NONE],
    [new RegExp('^line\-stacking\-shift'), 1, NONE],
    [new RegExp('^line\-stacking\-strategy'), 1, NONE],
    [new RegExp('^mark'), 1, NONE],
    [new RegExp('^mark\-after'), 1, NONE],
    [new RegExp('^mark\-before'), 1, NONE],
    [new RegExp('^marks'), 1, NONE],
    [new RegExp('^marquee\-direction'), 1, CHROME | SAFARI],
    [new RegExp('^marquee\-play\-count'), 1, CHROME | SAFARI],
    [new RegExp('^marquee\-speed'), 1, CHROME | SAFARI],
    [new RegExp('^marquee\-style'), 1, CHROME | SAFARI],
    [new RegExp('^move\-to'), 1, NONE],
    [new RegExp('^nav\-down'), 1, OPERA],
    [new RegExp('^nav\-index'), 1, OPERA],
    [new RegExp('^nav\-left'), 1, OPERA],
    [new RegExp('^nav\-right'), 1, OPERA],
    [new RegExp('^nav\-up'), 1, OPERA],
    [new RegExp('^opacity'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^outline\-offset'), 1, FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^overflow\-style'), 1, NONE],
    [new RegExp('^overflow\-x'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^overflow\-y'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^page'), 1, NONE],
    [new RegExp('^page\-policy'), 1, NONE],
    [new RegExp('^perspective'), 1, CHROME | SAFARI],
    [new RegExp('^perspective\-origin'), 1, CHROME | SAFARI],
    [new RegExp('^punctuation\-trim'), 1, NONE],
    [new RegExp('^rendering\-intent'), 1, NONE],
    [new RegExp('^resize'), 1, FIREFOX | CHROME | SAFARI],
    [new RegExp('^rest'), 1, NONE],
    [new RegExp('^rest\-after'), 1, NONE],
    [new RegExp('^rest\-before'), 1, NONE],
    [new RegExp('^rotation'), 1, NONE],
    [new RegExp('^rotation\-point'), 1, NONE],
    [new RegExp('^ruby\-align'), 1, IE9PLUS],
    [new RegExp('^ruby\-overhang'), 1, IE9PLUS],
    [new RegExp('^ruby\-position'), 1, IE9PLUS],
    [new RegExp('^ruby\-span'), 1, NONE],
    [new RegExp('^size'), 1, NONE],
    [new RegExp('^string\-set'), 1, NONE],
    [new RegExp('^target'), 1, NONE],
    [new RegExp('^target\-name'), 1, NONE],
    [new RegExp('^target\-new'), 1, NONE],
    [new RegExp('^target\-position'), 1, NONE],
    [new RegExp('^text\-align\-last'), 1, NONE],
    [new RegExp('^text\-emphasis'), 1, NONE],
    [new RegExp('^text\-height'), 1, NONE],
    [new RegExp('^text\-justify'), 1, ALLIE],
    [new RegExp('^text\-outline'), 1, NONE],
    [new RegExp('^text\-overflow'), 1, ALLIE | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^text\-shadow'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^text\-wrap'), 1, NONE],
    [new RegExp('^transform'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transform\-origin'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transform\-style'), 1, CHROME | SAFARI],
    [new RegExp('^transition'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transition\-property'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transition\-duration'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transition\-timing\-function'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^transition\-delay'), 1, IE9PLUS | FIREFOX | CHROME | SAFARI | OPERA],
    [new RegExp('^word\-break'), 1, ALLIE | FIREFOX | CHROME | SAFARI],
    [new RegExp('^word\-wrap'), 1, ALLIE | FIREFOX | CHROME | SAFARI | OPERA]
]

// some hacks
var RULESET_HACKS = [
    [new RegExp('\\*html'),                 1, IE6],
    [new RegExp('\\*\\+html'),               1, IE7],
    [new RegExp('\\*:first\-child\\+html'),  1, IE7],
    [new RegExp('html>body'),              1, IE7 | IE8 | IE9PLUS],
    [new RegExp('html>/\\*\\*/body'),        1, IE8 | IE9PLUS],
    [new RegExp('.*\-webkit\-'),           1, WEBKIT],
    [new RegExp('.*\-moz\-'),              1, FIREFOX],
    [new RegExp('.*\-ms\-'),               1, IE9PLUS],
    [new RegExp('.*\-o\-'),                1, OPERA],

    //auto generated by script AUTO-GENERATOR-2 .
    [new RegExp('.+:first\-line'), 1, NOIE6],
    [new RegExp('.+:first\-letter'), 1, NOIE6],
    [new RegExp('\\.[^\\s]+\\.[^\\s]+'), 2, NOIE6],
    [new RegExp('.+>.+'), 1, NOIE6],
    [new RegExp('.+:first\-child'), 1, NOIE6],
    [new RegExp('.+:focus'), 1, NOIE67],
    [new RegExp('.+\\+.+'), 1, NOIE6],
    [new RegExp('.+\\[.+\\]'), 1, NOIE6],
    [new RegExp('.+\\[.+=.+\\]'), 1, NOIE6],
    [new RegExp('.+\\[.+~=.+\\]'), 1, NOIE6],
    [new RegExp('.+:before'), 1, NOIE67],
    [new RegExp('.+:after'), 1, NOIE67],
    [new RegExp('.+~.+'), 1, NOIE6],
    [new RegExp('.+\\[.+\^=.+\\]'), 1, NOIE6],
    [new RegExp('.+\\[.+\$=.+\\]'), 1, NOIE6],
    [new RegExp('.+\\[.+\\*=.+\\]'), 1, NOIE6],
    [new RegExp('.+\\[.+\|=.+\\]'), 1, NOIE6],
    [new RegExp('.+:root'), 1, NOIE678],
    [new RegExp('.+:nth\-of\-type'), 1, NOIE678],
    [new RegExp('.+:nth\-last\-of\-type'), 1, NOIE678],
    [new RegExp('.+:first\-of\-type'), 1, NOIE678],
    [new RegExp('.+:last\-of\-type'), 1, NOIE678],
    [new RegExp('.+:only\-of\-type'), 1, NOIE678],
    [new RegExp('.+:only\-child'), 1, NOIE678],
    [new RegExp('.+:last\-child'), 1, NOIE678],
    [new RegExp('.+:nth\-child'), 1, NOIE678],
    [new RegExp('.+:nth\-last\-child'), 1, NOIE678],
    [new RegExp('.+:empty'), 1, NOIE678],
    [new RegExp('.+:target'), 1, NOIE678],
    [new RegExp('.+:checked'), 1, NOIE678],
    [new RegExp('.+::selection'), 1, NOIE678],
    [new RegExp('.+:enabled'), 1, NOIE678],
    [new RegExp('.+:disabled'), 1, NOIE678],
    [new RegExp('.+:not\(.+\)'), 1, NOIE678]
]

/*
# .test[fd*=df], .test:not(xxx) {
#      width:100px;
# }
# use .test:not(xxx) as important hack
*/
RULESET_HACKS = RULESET_HACKS.sort(function(a, b) {
    return a[2] - b[2]
});

// some hacks
var EXTRA_HACKS = [
    [new RegExp('@-webkit-keyframes'),   WEBKIT],
    [new RegExp('@-moz-keyframes'),      FIREFOX],
    [new RegExp('@-ms-keyframes'),       IE9PLUS],
    [new RegExp('@-o-keyframes'),        OPERA],
    [new RegExp('@keyframes'),             NONEIE | IE9PLUS],
    [new RegExp('@font-face'),           IE9PLUS | NONEIE],
    [new RegExp('@-moz-document'),       FIREFOX],
    [new RegExp('@mediascreenand\\(-webkit-min-device-pixel-ratio:0\\)'),  WEBKIT],
    [new RegExp('@mediascreenand\\(max-device-width:480px\\)'),               WEBKIT],
    [new RegExp('@mediaalland\\(-webkit-min-device-pixel-ratio:10000\\),notalland\\(-webkit-min-device-pixel-ratio:0\\)'),  OPERA]
]

function doRuleDetect(name, value) {
    name = '' + name;
    value = '' + value;
    var name = name.trim().replace(/\s+/g, '')
    var value = value.trim().replace(/\s+/g, '')

    for(var i = 0; i < RULE_HACKS.length; i++) {
        var hack = RULE_HACKS[i];
        var pattern = hack[0]
        var match = pattern.test(hack[1] == 1 ? name : value)
        if (match) {
            return hack[2]
        }
    }
        
    return STD
}

function doRuleSetDetect(selector) {
    var originSelector = selector.trim();
    selector = originSelector.replace(/\s+/g, '')
    for(var i = 0; i < RULESET_HACKS.length; i++) {
        var hack = RULESET_HACKS[i];
        var pattern = hack[0]
        var match = pattern.test(hack[1] == 1 ? selector : originSelector)
        if (match) {
            return hack[2]
        }
    }
    return STD
}

function doExtraDetect(selector) {
    selector = selector.trim().replace(/\s+/g, '')
    for(var i = 0; i < EXTRA_HACKS.length; i++) {
        var hack = EXTRA_HACKS[i];
        var pattern = hack[0]
        var match = pattern.test(selector)
        if (match)
            return hack[1]
    }
    return STD
}

exports.doRuleDetect = doRuleDetect
exports.doRuleSetDetect = doRuleSetDetect
exports.doExtraDetect = doExtraDetect

if (!module.parent) {
    // console.log(doRuleDetect('_width', 100))
    console.log((doRuleSetDetect('.a, .b')).toString(2))
    // console.log((doExtraDetect('@media screen and (-webkit-min-device-pixel-ratio:0)')).toString(2))
    // console.log((doExtraDetect('@media all and (-webkit-min-device-pixel-ratio:10000), not all and (-webkit-min-device-pixel-ratio:0)')).toString(2))
}