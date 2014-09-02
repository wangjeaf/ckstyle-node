var fs = require('fs');
var pathm = require('path');

var CssParser = require('./parser/index').CSSParser
var CssChecker = require('./ckstyler').CssChecker
var args = require('./command/args');
var ReporterUtil = require('./reporter/index').ReporterUtil

var defaultConfig = new args.CommandArgs()

function doCheck(fileContent, fileName, config) {
    fileName = fileName || ''
    config = config || defaultConfig

    config.operation = 'ckstyle'
    parser = new CssParser(fileContent, fileName)
    //parser.doParse(config)

    checker = new CssChecker(parser, config)
    checker.prepare();
    //checker.loadPlugins(os.path.realpath(os.path.join(__file__, '../plugins')))
    checker.doCheck()

    return checker
}

function checkFile(filePath, config) {
    config = config || defaultConfig
    fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'})
    console.log('[ckstyle] checking ' + filePath)
    checker = doCheck(fileContent, filePath, config)
    path = pathm.realpath(filePath + config.extension)
    if (checker.hasError()) {
        reporter = ReporterUtil.getReporter(config.exportJson ? 'json' : 'text', checker)
        reporter.doReport()
        if (config.printFlag) {
            if (fs.existsSync(path)) {
                fs.unlinkSync(path)
            }
            console.log(reporter.export() + '\n')
        } else {
            fs.writeFileSync(path, reporter.export())
            console.log('[ckstyle] @see %s\n' % path)
        }
        return false
    } else {
        if (config.exportJson)
            console.log('{"status":"ok","result":"' + filePath + ' is ok"}')
        else
            console.log('[ckstyle] ' + filePath + ' is ok\n')
        if (fs.existsSync(path)) {
            fs.unlinkSync(path)
        }
        return true
    }
} 

function checkDir(directory, config) {
    config = config || defaultConfig
    if (config.recursive)
        checkDirRecursively(directory, config)
    else
        checkDirSubFiles(directory, config)
}

function endswith(filename, extname) {
    return filename.indexOf(extname) == filename.length - extname.length;
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
    // for dirpath, dirnames, filenames in os.walk(directory):
    //     for filename in filenames:
    //         if not filename.endswith('.css') or filename.startswith('_'):
    //             continue
    //         checkFile(os.path.join(dirpath, filename), config)
}

function checkCssText(text) {
    checker = doCheck(text)
    reporter = ReporterUtil.getReporter('text', checker)
    reporter.doReport()
    console.log(reporter.export())
}

exports.doCheck = doCheck;