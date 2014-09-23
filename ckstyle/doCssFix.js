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

function doFix(fileContent, fileName, config) {
    fileName = fileName || ''
    config = config || defaultConfig

    config.operation = 'fix'
    var parser = new CssParser(fileContent, fileName)
    //parser.doParse(config)

    var checker = new CssChecker(parser, config)
    checker.prepare();
    //checker.loadPlugins(os.path.realpath(os.path.join(__file__, '../plugins')))
    var fixed = checker.doFix()

    return [checker, fixed]
}

function forJsFix(fileContent, config) {
    return doFix(fileContent, '', config)[1]
}

function fixFile(filePath, config) {
    if (!filePath || !fs.existsSync(filePath)) {
        logger.error('[fix] file not exist: ' + filePath)
        return;
    }

    config = config || defaultConfig
    
    path = config.output

    if (path)
        logger.ok('[fix] fixing ' + filePath)

    fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'})

    var result = doFix(fileContent, filePath, config)
    checker = result[0]
    msg = result[1]

    if (!path) {
        logger.out(msg)
    } else {
        fs.writeFileSync(path, msg)
        logger.ok('[fix] fixed ==> ' + path)
    }
} 

function fix(file, config) {
    if (!file || !fs.existsSync(file)) {
        logger.error('[fix] file not exist: ' + file)
        return;
    }
    if (fs.statSync(file).isDirectory()){
        if (config.recursive) {
            fixDirRecursively(file, config)
        } else {
            fixDirSubFiles(file, config)
        }
    } else {
        fixFile(file, config)
    }
}

function fixDir(directory, config) {
    config = config || defaultConfig
    if (config.recursive)
        fixDirRecursively(directory, config)
    else
        fixDirSubFiles(directory, config)
}

function fixDirSubFiles(directory, config) {
    config = config || defaultConfig
    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        fixFile(pathm.join(directory, filename), config)
    });
}

function fixDirRecursively(directory, config) {
    config = config || defaultConfig

    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        if (fs.statSync(filename).isDirectory()){
            fixDirRecursively(pathm.join(directory, fileName), config)
            return
        }
        fixFile(pathm.join(directory, filename), config)
    });
}

exports.doFix = doFix
exports.fix = fix
exports.fixStr = forJsFix