var Checker = require('./helper').Checker

exports.doTest = function() {
    var expected = '@media only screen and (-o-min-device-pixel-ratio:2/1),only screen and (min--moz-device-pixel-ratio:2),only screen and (-moz-min-device-pixel-ratio:2),only screen and (-webkit-min-device-pixel-ratio:2),only screen and (min-resolution:192dpi),only screen and (min-resolution:2dppx){.selector{background-image:url(@2xaaa.png);background-size:100px 20px}}';
    var css = '@media\
  only screen and (-o-min-device-pixel-ratio: 2/1), /* Opera */\
  only screen and (min--moz-device-pixel-ratio: 2), /* Firefox 16 之前 */\
  only screen and (-moz-min-device-pixel-ratio: 2), /* Firefox */\
  only screen and (-webkit-min-device-pixel-ratio: 2), /* WebKit */\
  only screen and (min-resolution: 192dpi), /* 不支持dppx的浏览器 */\
  only screen and (min-resolution: 2dppx) /* 标准 */\
{\
  .selector{\
    background-image:url(@2xaaa.png);/* Retina */\
    background-size: 100px 20px;\
  }'
    var checker = new Checker(css)
    checker.prepare();
    var res = checker.doCompress()
    equal(res, expected, 'ok');
}