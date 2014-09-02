var assert = require("assert")

// 测试中需要的数据全部都在这里准备好

var ckstyle = require('../ckstyle');

var fill = require('../ckstyle/reporter/helper').fill

var fileCounter = 0;

var okCounter = 0;
var errorCounter = 0;

var globalSilent = false;

function heredoc(fn) {
    return fn.toString()
        .replace(/^[^\/]+\/\*!?/, "")
        .replace(/\*\/[^\/]+$/, "")
        .replace(/^[\s\xA0]+/, "")
        .replace(/[\s\xA0]+$/, "");
};

global.heredoc = heredoc

function fillDicts(logs, warnings, errors, expectedErrors) {
    expectedErrors.forEach(function(expected) {
        var level = expected.name.trim()
        var value = expected.value.split('(from ')[0].trim()

        if (level == 2) {
            logs[value] = 1
        } else if (level == 1) {
            warnings[value] = 1
        } else if (level == 0) {
            errors[value] = 1
        }
    })
}

function checkUnitTestResult(expecteds, reals, level, fileName) {
    reals.forEach(function(real) {
        real = fill(real)
        real = real.split('(from "')[0].trim()
        if (expecteds[real]) {
            okCounter = okCounter + 1
            expecteds[real] = 0
        } else {
            errorCounter = errorCounter + 1
            !globalSilent && console.log('[UnitTest] [unexpected but has] level ' + level + '( ' + real + ' )' + ' in ' + fileName)
        }
    });
    for (var key in expecteds) {
        var value = expecteds[key]
        if (value == 1) {
            errorCounter = errorCounter + 1
            !globalSilent && console.log('[UnitTest] [expect but has not] level ' + level + '( ' + key + ' )' + ' in ' + fileName)
        }
    }
}

global.doCSSCheck = function(css, filename, silent) {
    globalSilent = !!silent;
    var checker = new ckstyle.CssChecker(css, {
        ignoreRuleSets: ['@unit-test-expecteds']
    });
    checker.prepare();
    checker.doCheck();

    var testErrorSet = checker.parser.styleSheet.getRuleSetBySelector('@unit-test-expecteds');
    if (!testErrorSet) {
        console.error('no @unit-test-expecteds in ' + filename)
        return;
    }
    var reals = checker.getErrors();
    var expectedErrors = testErrorSet.getRules()
    if (!expectedErrors) {
        console.error('no error instance in @unit-test-expecteds, ' + filename)
        return;
    }
    fileCounter += 1;
    var logs = {}
    var warnings = {}
    var errors = {}

    fillDicts(logs, warnings, errors, expectedErrors)

    var realLogs = reals[0]
    var realWarnings = reals[1]
    var realErrors = reals[2]

    checkUnitTestResult(logs, realLogs, '2', filename)
    checkUnitTestResult(warnings, realWarnings, '1', filename)
    checkUnitTestResult(errors, realErrors, '0', filename)

    return errorCounter;
}

global.equal = function(a, b, msg) {
    assert.equal(b, a, msg);
}

global.ok = function(a) {
    assert.ok(a);
}

global.len = function(arr) {
    return arr.length;
}