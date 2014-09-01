var parseCkStyleCmdArgs = require('./helper').parseCkStyleCmdArgs
var parseCompressCmdArgs = require('./helper').parseCompressCmdArgs
var parseFixStyleCmdArgs = require('./helper').parseFixStyleCmdArgs
var realpath = require('./helper').realpath

exports.doTest = function() {
    _default()
}

function _default() {
    config = parseCkStyleCmdArgs(realpath('ckstyle.ini'), [], [], true)
    equal(config.errorLevel, 0, 'errorLevel is 0')
    equal(config.recursive, false, 'recursive is false')
    equal(config.printFlag, false, 'print flag is false')
    equal(config.include, 'all', 'include is all')
    equal(config.exclude, 'none', 'exclude is none')
    equal(config.extension, '.ckstyle.txt', 'extension is ok')
    equal(config.fixedExtension, '.fixed.css', 'fixed extension is ok')
    equal(config.safeMode, false, 'safemode is false default')
    equal(config.noBak, false, 'no bak is false default')
    equal(len(config.ignoreRuleSets), 1, 'one ruleset to be ignored')

    equal(config.compressConfig.extension, '.min.css', 'extension is .min.css')
    equal(config.compressConfig.combineFile, false, 'combine file is false')
    equal(config.compressConfig.browsers, null, 'browsers is null')
    equal(config.compressConfig.noBak, false, 'no bak is false default')

    config = parseCkStyleCmdArgs(realpath('ckstyle.ini'), [("--errorLevel", "2"), ("--include", "abcde"), ("--exclude", "fghi"), ("-p", true), ("-r", true)], [], true)

    equal(config.errorLevel, 2, 'errorLevel is 2')
    equal(config.recursive, true, 'recursive is true')
    equal(config.printFlag, true, 'print flag is true')
    equal(config.include, 'abcde', 'include is abcde')
    equal(config.exclude, 'fghi', 'exclude is fghi')

    config = parseCompressCmdArgs(realpath('ckstyle.ini'), [("--errorLevel", "2"), ("--include", "abcde"), ("--exclude", "fghi"), ("-p", true), ("-r", true), ('--compressExtension', '.xxx.min.css'), ('--browsers', 'ie6,ie7,std'), ('--combineFile', 'true'), ("--safeMode", true), ("--noBak", true)], [], true)
    equal(config.errorLevel, 2, 'errorLevel is 2')
    equal(config.recursive, true, 'recursive is true')
    equal(config.printFlag, true, 'print flag is true')
    equal(config.include, 'abcde', 'include is abcde')
    equal(config.exclude, 'fghi', 'exclude is fghi')
    equal(config.safeMode, true, 'safemode is true')
    equal(config.noBak, false, 'noBak in config is true')
    equal(config.compressConfig.noBak, true, 'noBak in config.compressConfig is true')

    equal(config.compressConfig.extension, '.xxx.min.css', 'extension changed')
    equal(config.compressConfig.combineFile, true, 'combine file is true')
    equal(config.compressConfig.browsers.has_key('ie6'), true, 'browsers is true')

    config = parseFixStyleCmdArgs(realpath('ckstyle.ini'), [("--errorLevel", "2"), ("--include", "abcde"), ("--exclude", "fghi"), ("-p", true), ("-r", true), ('--fixedExtension', '.xxx.fixed.css'), ("--singleLine", true), ("--safeMode", true), ("--noBak", true)], [], true)
    equal(config.errorLevel, 2, 'errorLevel is 2')
    equal(config.recursive, true, 'recursive is true')
    equal(config.printFlag, true, 'print flag is true')
    equal(config.include, 'abcde', 'include is abcde')
    equal(config.exclude, 'fghi', 'exclude is fghi')
    equal(config.safeMode, true, 'safemode is true')
    equal(config.noBak, true, 'noBak in fixstyle is true')

    equal(config.fixToSingleLine, true, 'fix to single line is true')
    equal(config.fixedExtension, '.xxx.fixed.css', 'fixed extension changed')
}