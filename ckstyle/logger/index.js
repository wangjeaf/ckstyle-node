var colors = require('colors')

var prefix = '[CKStyle] '.cyan

function log(msg) {
    console.log(prefix + msg)
}

function warn(msg) {
    console.log(prefix + msg.yellow)
}

function error(msg) {
    console.log(prefix + msg.red)
}

function ok(msg) {
    console.log(prefix + msg.green)
}

exports.log = log
exports.warn = warn
exports.error = error
exports.ok = ok