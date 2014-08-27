var ReporterUtil = {}

var mapper = {
    text: './TextReporter',
    json: './JsonReporter',
    xml: './XMLReporter',
}

ReporterUtil.getReporter = function(reporterType, checker) {
    var Reporter = require(mapper[reporterType]);
    return new Reporter(checker);
}

exports.ReporterUtil = ReporterUtil