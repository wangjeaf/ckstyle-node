var ReporterUtil = {}

var mapper = {
    text: './TextReporter',
    json: './JsonReporter',
    html: './HtmlReporter'
}

ReporterUtil.getReporter = function(reporterType, checker) {
    var Reporter = require(mapper[reporterType]);
    return new Reporter(checker);
}

exports.ReporterUtil = ReporterUtil