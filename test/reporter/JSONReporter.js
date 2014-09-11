var Checker = require('./helper').Checker
var ReporterUtil = require('./helper').ReporterUtil

exports.doTest = function() {
    var checker = new Checker(".a{border:1px; border-width:2px; font-size: 12px; line-height: 49px;}")

    checker.prepare();
    checker.doCheck()

    var reporter = ReporterUtil.getReporter('json', checker)
    reporter.doReport()
    equal(reporter.export(), '{"msgs":[],"warnings":["should combine \\"border,border-width\\" to \\"border\\" in \\".a\\"","\\"font-size\\" should after \\"line-height\\" in \\".a\\" (order: display/box/text/other/css3)"],"logs":["selector should end with only one space \\".a\\"","should have \\"only one space\\" before the opening brace in \\".a\\"","should have one \\"space\\" before \\"border\\" in \\".a\\"","should have one \\"space\\" before value of \\"border-width\\" in \\".a\\""],"errors":["should add @author in the head of \\"TMP\\""]}', 'json reporter ok')
}