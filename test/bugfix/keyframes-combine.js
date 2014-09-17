var Checker = require('./helper').Checker

exports.doTest = function() {
    var checker = new Checker("\n\
    @keyframes blink {\n\
      /* 重复的 keyframes 应当被压缩 */\n\
      0%   { background-color: #fff; }\n\
      50%  { background-color: #000; }\n\
      100% { background-color: #fff; }\n\
    }")

    checker.prepare();
    var res = checker.doCompress()
    equal(res, '@keyframes blink{0%,100%{background-color:#FFF}50%{background-color:#000}}', 'ok');
}
