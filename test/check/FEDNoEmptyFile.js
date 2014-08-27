//from helper import doCssCheck, doCssTextCheck
var fill = require('../../ckstyle/reporter/helper').fill
var doCssTextCheck = require('./helper').doCssTextCheck

exports.doTest = function() {
    var result = doCssTextCheck('/* @author: zhifu.wang **/ /* .test {width: 100px;}*/', 'test.css')
    var logs = result[0]
    var warns = result[1]
    var errors = result[2]

    equal(errors.length, 1, 'should have one error occur')
    equal(fill(errors[0]), 'empty css file "test.css"')

    var result = doCssTextCheck('/* @author: zhifu.wang **/ /* .test {width: 100px;}*/ \n.test { width: 100px; }', 'test.css')
    var logs = result[0]
    var warns = result[1]
    var errors = result[2]
    equal(errors.length, 0, 'no error now')
}

// if (!module.parent) {
//     var result = doCssTextCheck('/* @author: zhifu.wang **/ /* .test {width: 100px;}*/', 'test.css')
//     console.log(result)
// }