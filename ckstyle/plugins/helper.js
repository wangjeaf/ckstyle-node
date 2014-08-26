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


exports.isFontFamilyName = function(font) {
    font = font.toLowerCase()
    var added = "," + font + ","
    return fontFamilyNames.indexOf(font) != -1 || fontFamilyNames.indexOf(added) != -1
}
exports.isCss3PrefixProp = function(prop) {
	return valueInArray(prefixCss3Props, prop)
}
exports.isCss3Prop = function(prop) {
	return valueInArray(prefixCss3Props, prop)
}
function valueInArray(arr,val){
	for(var i =0,l = arr.length;i<l;i++){
		if(arr[i]==val)
			return true
	}
	return false
}