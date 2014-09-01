exports.heredoc = function(fn) {
    return fn.toString()
        .replace(/^[^\/]+\/\*!?/, "")
        .replace(/\*\/[^\/]+$/, "")
        .replace(/^[\s\xA0]+/, "")
        .replace(/[\s\xA0]+$/, "");
};

var fontFamilyNames = ("'arial black','book antiqua','comic sans ms','courier new','lucida console','lucida grande','lucida sans unicode','palatino linotype','times new roman','trebuchet ms',arial,charcoal,courier,cursive,gadget,geneva,geneva,helvetica,helvetica,impact,monaco,monospace,monospace,palatino,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,serif,serif,tahoma,times,verdana" + ",georgia").split(',')
var allCss3Props = ('animation-name animation-duration animation-timing-function animation-delay animation-iteration-count animation-direction animation-play-state background-clip background-origin background-size border-bottom-left-radius border-bottom-right-radius border-image border-image-outset border-image-repeat border-image-slice border-image-source border-image-width border-radius border-top-left-radius border-top-right-radius box-decoration-break box-shadow overflow-x overflow-y overflow-style rotation rotation-point color-profile opacity rendering-intent bookmark-label bookmark-level bookmark-target float-offset hyphenate-after hyphenate-before hyphenate-character hyphenate-lines hyphenate-resource hyphens image-resolution marks string-set box-align box-direction box-flex box-flex-group box-lines box-ordinal-group box-orient box-pack @font-face font-size-adjust font-stretch crop move-to page-policy grid-columns grid-rows target target-name target-new target-position alignment-adjust alignment-baseline baseline-shift dominant-baseline drop-initial-after-adjust drop-initial-after-align drop-initial-before-adjust drop-initial-before-align drop-initial-size inline-box-align line-stacking line-stacking-ruby line-stacking-shift line-stacking-strategy text-height marquee-direction marquee-play-count marquee-speed marquee-style column-count column-fill column-gap column-rule column-rule-color column-rule-style column-rule-width column-span column-width columns fit fit-position image-orientation page size ruby-align ruby-overhang ruby-position ruby-span mark mark-after mark-before phonemes rest rest-after rest-before voice-balance voice-duration voice-pitch voice-pitch-range voice-rate voice-stress voice-volume hanging-punctuation punctuation-trim text-align-last text-justify text-outline text-overflow text-shadow text-wrap word-break word-wrap transform transform-origin transform-style perspective perspective-origin backface-visibility transition transition-property transition-duration transition-timing-function transition-delay appearance box-sizing icon nav-down nav-index nav-left nav-right nav-up outline-offset user-select resize animation animation-fill-mode border-end border-end-color border-end-style border-end-width border-start border-start-color border-start-style border-start-width line-break margin-end margin-start padding-end padding-start tab-size text-size-adjust user-modify writing-mode').split(' ')
//from https://github.com/stubbornella/csslint/wiki/Require-compatible-vendor-prefixes
var prefixCss3Props = ('animation animation-delay animation-direction animation-duration animation-fill-mode animation-iteration-count animation-name animation-play-state animation-timing-function appearance border-end border-end-color border-end-style border-end-width border-image border-radius border-start border-start-color border-start-style border-start-width box-align box-direction box-flex box-lines box-ordinal-group box-orient box-pack box-sizing box-shadow column-count column-gap column-rule column-rule-color column-rule-style column-rule-width column-width hyphens line-break margin-end margin-start marquee-speed marquee-style padding-end padding-start tab-size text-size-adjust transform transform-origin transition transition-delay transition-duration transition-property transition-timing-function user-modify user-select background-size writing-mode').split(' ')

var simpleSelectors = ('.nav .sub #main #main2 #sidebar #sidebar2 .header .footer .publisher .box .login .site-nav .side').split(' ');

var validHTMLTags = ('a abbr acronym address applet area article aside audio b base basefont bdi bdo big blockquote body br button canvas caption center cite code col colgroup command datalist dd del details dfn dir div dl dt em embed fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link map mark menu meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr track tt u ul var video wbr').split(' ')
var appearanceWords = ("left right top bottom float" + " aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgrey darkgreen darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite goldenrod gray grey green greenyellow honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgrey lightgreen lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen").split(' ')


exports.isFontFamilyName = function(font) {
    var font = font.toLowerCase();
    var added = "," + font + ",";
    return fontFamilyNames.indexOf(font) != -1 || fontFamilyNames.indexOf(added) != -1
}
exports.isCss3PrefixProp = function(prop) {
	return valueInArray(prefixCss3Props, prop)
}
exports.isCss3Prop = function(prop) {
	return valueInArray(prefixCss3Props, prop)
}

exports.isSimpleSelector = function (selector) {
	for (var i = 0, l = simpleSelectors.length; i < l; i++) {
		if (simpleSelectors[i] == selector)
			return true;
	}
	return false
}
exports.isHTMLTag = function(tag){
    return valueInArray(validHTMLTags, tag)
}
exports.existsAppearanceWords = function(selector){
    var selector = selector.toLowerCase();
    var words = selector.match(/\w+/g);
	
	if(words == null)
		return null
	
    for (var i = 0,l = words.length;i<l;i++){
	        if(valueInArray(appearanceWords,words[i]))
            return words[i]
	}

    return null	
}

function valueInArray(arr,val){
	for(var i =0,l = arr.length;i<l;i++){
		if(arr[i]==val)
			return true
	}
	return false
}