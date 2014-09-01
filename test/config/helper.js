var pathm = require('path')

var CommandFileParser = require('../../ckstyle/command').CommandFileParser
var ConsoleCommandParser = require('../../ckstyle/command').ConsoleCommandParser

var parseCkStyleCmdArgs = ConsoleCommandParser.parseCkStyleCmdArgs
var parseFixStyleCmdArgs = ConsoleCommandParser.parseFixStyleCmdArgs
var parseCompressCmdArgs = ConsoleCommandParser.parseCompressCmdArgs

function realpath(filepath) {
    path = pathm.join(__dirname, filepath)
    return path
}

function parseConfigFile(path) {
    parser = new CommandFileParser(realpath(path), true)
    config = parser.args
    return config
}

exports.parseConfigFile = parseConfigFile;
exports.parseCkStyleCmdArgs = parseCkStyleCmdArgs
exports.parseFixStyleCmdArgs = parseFixStyleCmdArgs
exports.parseCompressCmdArgs = parseCompressCmdArgs
exports.realpath = realpath