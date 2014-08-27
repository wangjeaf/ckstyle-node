var doFix = require('../../ckstyle/doCssFix').doFix;
var args = require('../../ckstyle/command/args');

var defaultConfig = new args.CommandArgs()

exports.getDefaultConfig = function() {
    return defaultConfig
}

exports.doFix = doFix;

exports.getFixed = function(css, name) {
    var result = doFix(css, '')
    var fixer = result[0];
    var msg = result[1];

    ruleSet = fixer.getStyleSheet().getRuleSets()[0]
    rule = ruleSet.getRuleByName(name)
    return rule.fixedValue
}