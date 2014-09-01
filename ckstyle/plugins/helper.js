exports.heredoc = function(fn) {
    return fn.toString()
        .replace(/^[^\/]+\/\*!?/, "")
        .replace(/\*\/[^\/]+$/, "")
        .replace(/^[\s\xA0]+/, "")
        .replace(/[\s\xA0]+$/, "");
};

exports.isFontFamilyName = function(font) {
    font = font.toLowerCase()
    var added = "," + font + ","
    return fontFamilyNames.indexOf(font) != -1 || fontFamilyNames.indexOf(added) != -1
}


var pattern = /[@\*\[\]\(\):>]/

function len(arr) {
    return arr.length;
}

function hasHackChars(text) {
    return !!pattern.exec(text)
}
exports.hasHackChars = hasHackChars;

function containsHack(rule) {
    return rule.value.indexOf('\\0') != -1 || rule.value.indexOf('\\9') != -1
}
exports.containsHack = containsHack;

function getAttrOrder(attr, strippedName) {
    if (attr in cssAttrOrders)
        return cssAttrOrders[attr] + addCss3PrefixValue(strippedName)
    if (attr.indexOf('-') != -1) {
        var splited = attr.split('-')
        var tmp = splited[0] + '-' + splited[len(splited) - 1]
        if (tmp in cssAttrOrders)
            return cssAttrOrders[tmp] + addCss3PrefixValue(strippedName)
        while (len(splited) != 0) {
            splited = splited.slice(0, -1);
            tmp = splited.join('-')
            if (tmp in cssAttrOrders)
                return cssAttrOrders[tmp] + addCss3PrefixValue(strippedName)
        }
    }
    return 6000 + addCss3PrefixValue(strippedName)
}
exports.getAttrOrder = getAttrOrder

function addCss3PrefixValue(attr) {
    var value = 0
    if (attr.indexOf('-webkit') == 0)
        value = value - 5
    else if (attr.indexOf('-khtml') == 0)
        value = value - 4
    else if (attr.indexOf('-moz') == 0)
        value = value - 3
    else if (attr.indexOf('-ms') == 0)
        value = value - 2
    else if (attr.indexOf('-o') == 0)
        value = value - 1
    return value
}

function isHTMLTag(tag) {
    return containsInArray(validHTMLTags, tag)
}
exports.isHTMLTag = isHTMLTag;

function isCssProp(prop) {
    return containsInArray(validCSSAttrs, prop)
}
exports.isCssProp = isCssProp;

function isCss3Prop(prop) {
    return containsInArray(allCss3Props, prop)
}
exports.isCss3Prop = isCss3Prop;

function canBeCombined(prop) {
    prop = prop.trim()
    for(var i = 0; i < canBeCombinedProps.length; i++) {
        var x = canBeCombinedProps[i]
        if (prop.indexOf(x) == 0) {
            return x;
        }
    }
    return null;
}
exports.canBeCombined = canBeCombined;

function containsChnChar(string) {
    return /[\u4e00-\u9fa5]+/.test(string)
}
exports.containsChnChar = containsChnChar;

function isCss3PrefixProp(prop) {
    return containsInArray(prefixCss3Props, prop)
}
exports.isCss3PrefixProp = isCss3PrefixProp;

var wordsPattern = /\w+/g
function existsAppearanceWords(selector) {
    selector = selector.toLowerCase()
    words = selector.match(wordsPattern)
    for(var i = 0; i < words.length; i++) {
        var w = words[i];
        if (containsInArray(appearanceWords, w)) {
            return w;
        }
    }
    return null;
}
exports.existsAppearanceWords = existsAppearanceWords;

function isSimpleSelector(selector) {
    for(var i = 0; i < simpleSelectors.length; i++) {
        if (simpleSelectors[i] == selector) {
            return true;
        }
    }
    return false;
}
exports.isSimpleSelector = isSimpleSelector;

function containsInArray(array, value) {
    return array.indexOf(value) != -1
}

var maybeDoNotNeedPrefix = 'border-radius'.split(' ')

function doNotNeedPrefixNow(attr) {
    attr = attr.trim()
    if (attr.indexOf('border') == 0 && attr.indexOf('radius') == attr.length - 'radius'.length)
        return true

    for (var i = maybeDoNotNeedPrefix.length - 1; i >= 0; i--) {
        if (maybeDoNotNeedPrefix[i].indexOf(attr) != -1) {
            return true;
        }
    }

    return false;
}
exports.doNotNeedPrefixNow = doNotNeedPrefixNow;

// from https://github.com/stubbornella/csslint/wiki/Require-compatible-vendor-prefixes
var prefixCss3Props = 'animation animation-delay animation-direction animation-duration animation-fill-mode animation-iteration-count animation-name animation-play-state animation-timing-function appearance border-end border-end-color border-end-style border-end-width border-image border-radius border-start border-start-color border-start-style border-start-width box-align box-direction box-flex box-lines box-ordinal-group box-orient box-pack box-sizing box-shadow column-count column-gap column-rule column-rule-color column-rule-style column-rule-width column-width hyphens line-break margin-end margin-start marquee-speed marquee-style padding-end padding-start tab-size text-size-adjust transform transform-origin transition transition-delay transition-duration transition-property transition-timing-function user-modify user-select background-size writing-mode'.split(' ')

// according to http://fed.renren.com/archives/1212
var cssAttrOrdersMap = {
    0 : ['display', 'position', 'left', 'top', 'bottom', 'right', 'float', 'list-style', 'clear'],
    200 : ['width', 'height', 'margin', 'padding', 'border'],
    400 : ['background'],
    600 : ['line-height'],
    800 : ['color', 'font', 'text-decoration', 'text-align', 'text-indent', 'vertical-align', 'white-space', 'content'],
    1000: ['cursor', 'z-index', 'zoom'],
    1200: prefixCss3Props
    // 1400 : ['other']
}

// convert 0:a, b to a:0, b:0
var cssAttrOrders = {}
for(var key in cssAttrOrdersMap) {
    var value = cssAttrOrdersMap[key];
    counter = 0;
    value.forEach(function(x) {
        cssAttrOrders[x] = key + counter
        counter = counter + 6
    })
}

var canBeCombinedProps = 'border margin padding background font'.split(' ')

// execute in http://www.w3schools.com/cssref/css_websafe_fonts.asp
//
// var tables = document.getElementsByClassName('reference');
// var values = [];
// for (var i = 0;  i < tables.length; i++) {
//     trs = tables[i].getElementsByTagName('tr')
//     for(var j = 0; j < trs.length; j++) {
//         td = trs[j].getElementsByTagName('td')[0];
//         if (td) {
//             var text = td.textContent.toLowerCase().trim()
//             var spliteds = text.split(',');
//             for (var k = 0; k < spliteds.length; k++) {
//                 values.push(spliteds[k].trim().replace('"', "'").replace('"', "'"))
//             }
//         }
//     }
// }
// values = values.slice(2);
// console.log(values.sort().join(','));

var fontFamilyNames = ("'arial black','book antiqua','comic sans ms','courier new','lucida console','lucida grande','lucida sans unicode','palatino linotype','times new roman','trebuchet ms',arial,charcoal,courier,cursive,gadget,geneva,geneva,helvetica,helvetica,impact,monaco,monospace,monospace,palatino,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,serif,serif,tahoma,times,verdana" + ",georgia").split(',')

// add slowly and progressively
var simpleSelectors = '.nav .sub #main #main2 #sidebar #sidebar2 .header .footer .publisher .box .login .site-nav .side'.split(' ')

//  execute in http://www.w3schools.com/cssref/css_colornames.asp
// 
// var tables = document.getElementsByClassName('reference');
// var values = [];
// for (var i = 0;  i < tables.length; i++) {
//     trs = tables[i].getElementsByTagName('tr')
//     for(var j = 0; j < trs.length; j++) {
//         td = trs[j].getElementsByTagName('td')[0];
//         if (td) {
//             var text = td.textContent.toLowerCase().trim()
//             if (text == 'h1') text = 'h1 h2 h3 h4 h5 h6';
//             values.push(text)
//         }
//     }
// }
// values = values.slice(2);
// console.log(values.join(' '));

var appearanceWords = ("left right top bottom float" + " aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgrey darkgreen darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite goldenrod gray grey green greenyellow honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgrey lightgreen lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen").split(' ')
// execute on http://www.w3schools.com/cssref/default.asp
//
// var tables = document.getElementsByClassName('reference');
// var values = [];
// for (var i = 0;  i < tables.length; i++) {
//     trs = tables[i].getElementsByTagName('tr')
//     for(var j = 0; j < trs.length; j++) {
//         td = trs[j].getElementsByTagName('td')[0];
//         if (td && trs[j].getElementsByTagName('td')[2].textContent == '3') {
//             var text = td.textContent
//             if (text == 'h1') text = 'h1 h2 h3 h4 h5 h6';
//             values.push(text)
//         }
//     }
// }
// values = values.slice(2);
// console.log(values.join(' '));
//
var allCss3Props = 'animation-name animation-duration animation-timing-function animation-delay animation-iteration-count animation-direction animation-play-state background-clip background-origin background-size border-bottom-left-radius border-bottom-right-radius border-image border-image-outset border-image-repeat border-image-slice border-image-source border-image-width border-radius border-top-left-radius border-top-right-radius box-decoration-break box-shadow overflow-x overflow-y overflow-style rotation rotation-point color-profile opacity rendering-intent bookmark-label bookmark-level bookmark-target float-offset hyphenate-after hyphenate-before hyphenate-character hyphenate-lines hyphenate-resource hyphens image-resolution marks string-set box-align box-direction box-flex box-flex-group box-lines box-ordinal-group box-orient box-pack @font-face font-size-adjust font-stretch crop move-to page-policy grid-columns grid-rows target target-name target-new target-position alignment-adjust alignment-baseline baseline-shift dominant-baseline drop-initial-after-adjust drop-initial-after-align drop-initial-before-adjust drop-initial-before-align drop-initial-size inline-box-align line-stacking line-stacking-ruby line-stacking-shift line-stacking-strategy text-height marquee-direction marquee-play-count marquee-speed marquee-style column-count column-fill column-gap column-rule column-rule-color column-rule-style column-rule-width column-span column-width columns fit fit-position image-orientation page size ruby-align ruby-overhang ruby-position ruby-span mark mark-after mark-before phonemes rest rest-after rest-before voice-balance voice-duration voice-pitch voice-pitch-range voice-rate voice-stress voice-volume hanging-punctuation punctuation-trim text-align-last text-justify text-outline text-overflow text-shadow text-wrap word-break word-wrap transform transform-origin transform-style perspective perspective-origin backface-visibility transition transition-property transition-duration transition-timing-function transition-delay appearance box-sizing icon nav-down nav-index nav-left nav-right nav-up outline-offset user-select resize animation animation-fill-mode border-end border-end-color border-end-style border-end-width border-start border-start-color border-start-style border-start-width line-break margin-end margin-start padding-end padding-start tab-size text-size-adjust user-modify writing-mode'.split(' ')

// execute on http://www.w3schools.com/tags/default.asp
//
// var tables = document.getElementsByClassName('reference');
// var values = [];
// for (var i = 0;  i < tables.length; i++) {
//     trs = tables[i].getElementsByTagName('tr')
//     for(var j = 0; j < trs.length; j++) {
//         td = trs[j].getElementsByTagName('td')[0];
//         if (td) {
//             var text = td.textContent.split('>')[0].split('<')[1]
//             if (text == 'h1') text = 'h1 h2 h3 h4 h5 h6';
//             values.push(text)
//         }
//     }
// }
// values = values.slice(2);
// console.log(values.join(' '));

var validHTMLTags = 'a abbr acronym address applet area article aside audio b base basefont bdi bdo big blockquote body br button canvas caption center cite code col colgroup command datalist dd del details dfn dir div dl dt em embed fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link map mark menu meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr track tt u ul var video wbr'.split(' ')


//  execute on http://www.w3schools.com/cssref/default.asp
// var tables = document.getElementsByClassName('reference');
// var values = [];
// for (var i = 0;  i < tables.length; i++) {
//     trs = tables[i].getElementsByTagName('tr')
//     for(var j = 0; j < trs.length; j++) {
//         td = trs[j].getElementsByTagName('td')[0];
//         if (td) {
//             values.push(td.textContent)
//         }
//     }
// }
// console.log(values.join(' '));

var validCSSAttrs = ('@keyframes animation animation-name animation-duration animation-timing-function animation-delay animation-iteration-count animation-direction animation-play-state ' + 
    'background background-attachment background-color background-image background-position background-repeat background-clip background-origin background-size background-inline-policy border border-bottom border-bottom-color border-bottom-style border-bottom-width border-color border-left border-left-color border-left-style border-left-width border-right border-right-color border-right-style border-right-width border-style border-top border-top-color border-top-style border-top-width border-width outline outline-color outline-style outline-width ' + 
    'border-bottom-left-radius border-bottom-right-radius border-image border-image-outset border-image-repeat border-image-slice border-image-source border-image-width border-radius border-top-left-radius border-top-right-radius box-decoration-break box-shadow overflow-x overflow-y overflow-style rotation rotation-point color-profile opacity rendering-intent bookmark-label bookmark-level bookmark-target float-offset ' + 
    'hyphenate-after hyphenate-before hyphenate-character hyphenate-lines hyphenate-resource hyphens image-resolution marks string-set height max-height max-width min-height min-width width box-align box-direction box-flex box-flex-group box-lines box-ordinal-group box-orient box-pack font font-family font-size font-style font-variant font-weight @font-face font-size-adjust font-stretch content counter-increment counter-reset quotes ' + 
    'crop move-to page-policy grid-columns grid-rows target target-name target-new target-position alignment-adjust alignment-baseline baseline-shift dominant-baseline drop-initial-after-adjust drop-initial-after-align drop-initial-before-adjust drop-initial-before-align drop-initial-size drop-initial-value inline-box-align line-stacking line-stacking-ruby line-stacking-shift line-stacking-strategy text-height list-style list-style-image ' + 
    'list-style-position list-style-type margin margin-bottom margin-left margin-right margin-top marquee-direction marquee-play-count marquee-speed marquee-style column-count column-fill column-gap column-rule column-rule-color column-rule-style column-rule-width column-span column-width columns padding padding-bottom padding-left padding-right padding-top fit fit-position image-orientation page size bottom clear clip cursor display ' + 
    'float left overflow position right top visibility z-index orphans page-break-after page-break-before page-break-inside widows ruby-align ruby-overhang ruby-position ruby-span mark mark-after mark-before phonemes rest rest-after rest-before voice-balance voice-duration voice-pitch voice-pitch-range voice-rate ' + 
    'voice-stress voice-volume border-collapse border-spacing caption-side empty-cells table-layout color direction letter-spacing line-height text-align text-decoration text-indent text-transform unicode-bidi vertical-align white-space word-spacing hanging-punctuation punctuation-trim text-align-last text-justify ' + 
    'text-outline text-overflow text-shadow text-wrap word-break word-wrap transform transform-origin transform-style perspective perspective-origin backface-visibility transition transition-property transition-duration transition-timing-function transition-delay appearance box-sizing icon nav-down nav-index nav-left ' + 
    'nav-right nav-up outline-offset resize expression filter zoom behavior').split(' ')

