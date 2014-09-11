var Checker = require('./helper').Checker
var ReporterUtil = require('./helper').ReporterUtil

exports.doTest = function() {
    var checker = new Checker(".a{border:1px; border-width:2px; font-size: 12px; line-height: 49px;}")

    checker.prepare();
    checker.doCheck()

    var reporter = ReporterUtil.getReporter('html', checker)
    reporter.doReport()
    equal(reporter.export(), 
'<div class="error">\n\
  <h2>ERROR</h2>\n\
  <ol>\n\
    <li>should add @author in the head of "TMP"</li>\n\
  </ol>\n\
</div>\n\
<div class="warn">\n\
  <h2>WARN</h2>\n\
  <ol>\n\
    <li>should combine "border,border-width" to "border" in ".a"</li>\n\
    <li>"font-size" should after "line-height" in ".a" (order: display/box/text/other/css3)</li>\n\
  </ol>\n\
</div>\n\
<div class="log">\n\
  <h2>LOG</h2>\n\
  <ol>\n\
    <li>selector should end with only one space ".a"</li>\n\
    <li>should have "only one space" before the opening brace in ".a"</li>\n\
    <li>should have one "space" before "border" in ".a"</li>\n\
    <li>should have one "space" before value of "border-width" in ".a"</li>\n\
  </ol>\n\
</div>\n', 'html reporter ok')
}