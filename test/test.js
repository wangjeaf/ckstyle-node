var styler = require('./ckstyler');
var BinaryRule = require('./browsers/BinaryRule');
var STD = BinaryRule.STD
var FIREFOX = BinaryRule.FIREFOX

var CssChecker = styler.CssChecker;
var checker = new CssChecker('.test{float-offset:test;background-origin:test;background-clip:test;color-profile:test;font-stretch:test;text-align-last:test;animation:test;animation-delay:test;animation-direction:test;animation-duration:test;animation-iteration-count:test;animation-name:test;animation-play-state:test;animation-timing-function:test;appearance:test;border-image-width:test;border-image-slice:test;border-image-outset:test;border-image-repeat:test;border-image-source:test;border-image:test;border-top-left-radius:test;border-radius:test;border-bottom-right-radius:test;border-bottom-left-radius:test;border-top-right-radius:test;box-align:test;box-direction:test;box-flex-group:test;box-flex:test;box-lines:test;box-ordinal-group:test;box-orient:test;box-pack:test;box-sizing:test;box-shadow:test;column-count:test;column-gap:test;column-rule:test;column-rule-color:test;column-rule-style:test;column-rule-width:test;column-width:test;hyphens:test;marquee-speed:test;marquee-style:test;transform-style:test;transform:test;transform-origin:test;transition:test;transition-delay:test;transition-duration:test;transition-property:test;transition-timing-function:test;background-size:test;hyphenate-characters:test;drop-initial-before-align:test;drop-initial-size:test;drop-initial-value:test;fit:test;fit-position:test;column-fill:test;bookmark-label:test;bookmark-level:test;grid-columns:test;grid-rows:test;hanging-punctuation:test;hyphenate-after:test;hyphenate-before:test;word-wrap:test;hyphenate-lines:test;hyphenate-resource:test;box-decoration-break:test;icon:test;image-orientation:test;image-resolution:test;inline-box-align:test;line-stacking:test;line-stacking-ruby:test;line-stacking-shift:test;line-stacking-strategy:test;mark:test;mark-after:test;mark-before:test;marks:test;marquee-direction:test;marquee-play-count:test;bookmark-target:test;backface-visibility:test;move-to:test;opacity:test;outline-offset:test;overflow-style:test;overflow-x:test;overflow-y:test;page:test;page-policy:test;perspective:test;perspective-origin:test;punctuation-trim:test;rendering-intent:test;resize:test;rest:test;rest-after:test;rest-before:test;rotation:test;rotation-point:test;ruby-span:test;size:test;string-set:test;target:test;target-name:test;target-new:test;target-position:test;column-span:test;text-emphasis:test;text-height:test;text-outline:test;text-overflow:test;text-shadow:test;text-wrap:test;alignment-adjust:test;columns:test;baseline-shift:test;crop:test;dominant-baseline:test;drop-initial-after-adjust:test;drop-initial-after-align:test;drop-initial-before-adjust:test;word-break:test;alignment-baseline:test}');
checker.prepare() // load plugins, do css parser;

// checker.doCheck();
// var errors = checker.getErrors()
//console.log(errors);

var fixed = checker.doFix();
console.log(fixed);
var compressed = checker.doCompress(STD | FIREFOX);
console.log(compressed);