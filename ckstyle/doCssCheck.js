var fs = require('fs');
var pathm = require('path');
var logger = require('./logger/index')
var CssParser = require('./parser/index').CSSParser
var CssChecker = require('./ckstyler').CssChecker
var args = require('./command/args');
var ReporterUtil = require('./reporter/index').ReporterUtil

var defaultConfig = new args.CommandArgs()

function endswith(filename, extname) {
    return filename.slice(extname.length * -1) == extname;
}

function doCheck(fileContent, fileName, config) {
    fileName = fileName || ''
    config = config || defaultConfig

    config.operation = 'check'
    var parser = new CssParser(fileContent, fileName)
    //parser.doParse(config)

    var checker = new CssChecker(parser, config)
    checker.prepare();
    //checker.loadPlugins(os.path.realpath(os.path.join(__file__, '../plugins')))
    checker.doCheck()

    return checker
}

function checkFile(filePath, config) {
    config = config || defaultConfig
    if (!filePath || !fs.existsSync(filePath)) {
        logger.error('[check] file not exist: ' + filePath)
        return;
    }
    var fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'})
    logger.log('[check] checking ' + filePath)
    var checker = doCheck(fileContent, filePath, config)
    var path = config.output
    if (checker.hasError()) {
        var reporter = ReporterUtil.getReporter(config.json ? 'json' : 'text', checker)
        reporter.doReport()
        if (!path) {
            logger.out(reporter.export() + '\n')
        } else {
            fs.writeFileSync(path, reporter.export())
            logger.log('[check] @see ' + path)
        }
        return false
    } else {
        if (config.json)
            logger.ok('{"status":"ok","result":"' + filePath + ' is ok"}')
        else
            logger.ok('[check] ' + filePath + ' is ok\n')
        return true
    }
} 

function check(file, config) {
    if (!file || !fs.existsSync(file)) {
        logger.error('[check] file not exist: ' + file)
        return;
    }
    if (fs.statSync(file).isDirectory()){
        if (config.recursive) {
            checkDirRecursively(file, config)
        } else {
            checkDirSubFiles(file, config)
        }
    } else {
        checkFile(file, config)
    }
}

function checkDir(directory, config) {
    config = config || defaultConfig
    if (config.recursive)
        checkDirRecursively(directory, config)
    else
        checkDirSubFiles(directory, config)
}

function checkDirSubFiles(directory, config) {
    config = config || defaultConfig
    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        checkFile(pathm.join(directory, filename), config)
    });
}

function checkDirRecursively(directory, config) {
    config = config || defaultConfig

    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        if (fs.statSync(filename).isDirectory()){
            checkDirRecursively(pathm.join(directory, fileName), config)
            return
        }
        checkFile(pathm.join(directory, filename), config)
    });
}

function checkCssText(text) {
    var checker = doCheck(text)
    var reporter = ReporterUtil.getReporter('text', checker)
    reporter.doReport()
    logger.log(reporter.export())
}

exports.doCheck = doCheck;
exports.check = check;
