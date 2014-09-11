var Checker = require('./helper').Checker
var ReporterUtil = require('./helper').ReporterUtil

exports.doTest = function() {
    var checker = new Checker(".a{border:1px; border-width:2px; font-size: 12px; line-height: 49px;}")

    checker.prepare();
    checker.doCheck()

    var reporter = ReporterUtil.getReporter('text', checker)
    reporter.doReport()
    equal(reporter.export(), '[ERROR] 1. should add @author in the head of "TMP"\n\
 [WARN] 2. should combine "border,border-width" to "border" in ".a"\n\
 [WARN] 3. "font-size" should after "line-height" in ".a" (order: display/box/text/other/css3)\n\
  [LOG] 4. selector should end with only one space ".a"\n\
  [LOG] 5. should have "only one space" before the opening brace in ".a"\n\
  [LOG] 6. should have one "space" before "border" in ".a"\n\
  [LOG] 7. should have one "space" before value of "border-width" in ".a"', 'text reporter ok')
}