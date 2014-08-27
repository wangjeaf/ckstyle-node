

var doCheck = require('../../ckstyle/doCssCheck').doCheck

function doCssCheck(fileContent, level) {
    level = level || 2
    checker = doCheck(fileContent)
    return checker.getErrors()
}

function doCssTextCheck(text, fileName) {
    fileName = fileName || ''
    checker = doCheck(text, fileName)
    return checker.getErrors()
}

exports.doCssCheck = doCssCheck
exports.doCssTextCheck = doCssTextCheck;