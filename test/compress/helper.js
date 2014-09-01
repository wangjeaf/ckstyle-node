var doCompress = require('../../ckstyle/doCssCompress').doCompress
var fs = require('fs');
var pathm = require('path');

var BinaryRule = require('../../ckstyle/browsers/BinaryRule');
for(var prop in BinaryRule) {
    global[prop] = BinaryRule[prop]
}

function doCssCompress(fileContent, fileName) {
    fileName = fileName || ''
    compressed = doCompress(fileContent, fileName)[1]
    return compressed
}

function doCssCompress2(fileContent, fileName) {
    fileName = fileName || ''
    checker = doCompress(fileContent, fileName)[0]
    return checker
}

function realpath(filepath) {
    path = pathm.join(__dirname, filepath)
    return path
}

function doCssFileCompress(path) {
    fileContent = fs.readFileSync(realpath(path), {encoding: 'utf-8'})
    return doCssCompress(fileContent, path)
}

function doCssFileCompress2(path) {
    fileContent = fs.readFileSync(realpath(path), {encoding: 'utf-8'})
    return doCssCompress2(fileContent, path)
}

exports.doCssCompress2 = doCssCompress2
exports.doCssCompress = doCssCompress
exports.doCssFileCompress2 = doCssFileCompress2
exports.doCssFileCompress = doCssFileCompress