var parseCkStyleCmdArgs = require('./helper').parseCkStyleCmdArgs
var parseConfigFile = require('./helper').parseConfigFile

exports.doTest = function() {
    _default()
    _configed()
    _missing()
}

function _missing() {
    config = parseConfigFile('ckstyle_missing.ini')
    equal(config.errorLevel, 2, 'error level is 0(ERROR) from python')
    equal(config.printFlag, false, 'print flag is false from python')
    equal(config.extension, '.ckstyle.txt', 'extension is ok from python')
    equal(config.include, 'all', 'include is all from python')
    equal(config.exclude, 'none', 'exclude is none from python')
    equal(config.standard, 'standard3.css', 'standard css file name is ok')
    equal(config.fixedExtension, '.fixed2.css', 'fixed extension is ok from python')
    equal(config.fixToSingleLine, false, 'fix to single line is false')
    equal(config.safeMode, false, 'safemode is false by file')
    equal(len(config.ignoreRuleSets), 1, 'one ignored rule set')
    equal(config.noBak, false, 'no bak is false by default')

    args = config.compressConfig
    equal(args.combineFile, true, 'combine file is still true')
    equal(args.browsers, null, 'browsers is false')
    equal(args.extension, '.lala.min.css', 'extension changed')
    equal(args.noBak, false, 'no bak is false by default')
}

function _configed() {
    config = parseConfigFile('ckstyle_configed.ini')
    equal(config.errorLevel, 2, 'error level is 2(LOG)')
    equal(config.printFlag, true, 'print flag is true')
    equal(config.extension, '.ckstyle2.txt', 'extension is ok')
    equal(config.include, 'abc', 'include is abc')
    equal(config.exclude, 'ddd', 'exclude is ddd')
    equal(config.standard, 'standard2.css', 'standard css file name is ok')
    equal(config.ignoreRuleSets[0], '@unit-test-expecteds', 'rule sets ignored')
    equal(config.ignoreRuleSets[1], '@unit-tests-fda', 'rule sets ignored')
    equal(len(config.ignoreRuleSets), 2, 'two ignored rule sets')
    equal(config.fixToSingleLine, true, 'fix to single line is true')
    equal(config.safeMode, true, 'safemode is true by file')
    equal(config.noBak, true, 'no bak is true by file')

    args = config.compressConfig
    equal(args.combineFile, true, 'combine file is true')
    equal(args.browsers.has_key('std'), true, 'browsers is true')
    equal(args.browsers.has_key('ie6'), true, 'browsers is true')
    equal(args.browsers.has_key('ie7'), true, 'browsers is true')
    equal(args.browsers.has_key('ie9'), false, 'browsers is true')
    equal(args.extension, '.min3.css', 'extension changed')
    equal(args.noBak, true, 'no bak is true')
}

function _default() {
    config = parseConfigFile('ckstyle.ini')
    equal(config.errorLevel, 0, 'error level is 0(ERROR)')
    equal(config.printFlag, false, 'print flag is false')
    equal(config.extension, '.ckstyle.txt', 'extension is ok')
    equal(config.include, 'all', 'include is all')
    equal(config.exclude, 'none', 'exclude is none')
    equal(config.standard, 'standard.css', 'standard css file name is ok')
    equal(config.ignoreRuleSets[0], '@unit-test-expecteds', 'rule sets ignored')
    equal(len(config.ignoreRuleSets), 1, 'only one ignored rule set')
    equal(config.fixToSingleLine, false, 'fix to single line is false default')
    equal(config.safeMode, false, 'safemode is false by file')
}