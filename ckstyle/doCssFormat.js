var fs = require('fs');
var pathm = require('path');

var logger = require('./logger/index')
var CssParser = require('./parser/index').CSSParser
var CssChecker = require('./ckstyler').CssChecker
var args = require('./command/args');

var defaultConfig = new args.CommandArgs()

function endswith(filename, extname) {
    return filename.slice(extname.length * -1) == extname;
}

function doFormat(fileContent, fileName, config) {
    fileName = fileName || ''
    config = config || defaultConfig

    config.operation = 'fix'
    var parser = new CssParser(fileContent, fileName)
    //parser.doParse(config)

    var checker = new CssChecker(parser, config)
    checker.prepare();
    //checker.loadPlugins(os.path.realpath(os.path.join(__file__, '../plugins')))
    var formatted = checker.doFormat()

    return [checker, formatted]
}

function forJsFormat(fileContent, config) {
    return doFormat(fileContent, '', config)[1]
}

function formatFile(filePath, config) {
    if (!filePath || !fs.existsSync(filePath)) {
        logger.error('[format] file not exist: ' + filePath)
        return;
    }

    config = config || defaultConfig
    path = config.output

    fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'})

    if (path) {
        logger.ok('[format] formatting ' + filePath)
    }

    var result = doFormat(fileContent, filePath, config)
    checker = result[0]
    msg = result[1]

    if (!path) {
        logger.out(msg)
    } else {
        fs.writeFileSync(path, msg)
        logger.ok('[format] formatted ==> ' + path)
    }
} 

function format(file, config) {
    if (!file || !fs.existsSync(file)) {
        logger.error('[format] file not exist: ' + file)
        return;
    }
    if (fs.statSync(file).isDirectory()){
        if (config.recursive) {
            formatDirRecursively(file, config)
        } else {
            formatDirSubFiles(file, config)
        }
    } else {
        formatFile(file, config)
    }
}

function formatDir(directory, config) {
    config = config || defaultConfig
    if (config.recursive)
        formatDirRecursively(directory, config)
    else
        formatDirSubFiles(directory, config)
}

function formatDirSubFiles(directory, config) {
    config = config || defaultConfig
    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        formatFile(pathm.join(directory, filename), config)
    });
}

function formatDirRecursively(directory, config) {
    config = config || defaultConfig

    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        if (fs.statSync(filename).isDirectory()){
            formatDirRecursively(pathm.join(directory, fileName), config)
            return
        }
        formatFile(pathm.join(directory, filename), config)
    });
}

exports.doFormat = doFormat
exports.format = format
exports.formatStr = forJsFormat