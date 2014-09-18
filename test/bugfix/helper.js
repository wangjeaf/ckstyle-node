var Checker = require('../../ckstyle/ckstyler').CssChecker;
var CommandArgs = require('../../ckstyle/command/args').CommandArgs
var config = new CommandArgs()

exports.Checker = Checker;
exports.config = config;