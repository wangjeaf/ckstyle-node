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

function prepare(fileContent, fileName, config) {
    fileName = fileName || ''
    config = config || defaultConfig
    config.operation = 'compress'

    var parser = new CssParser(fileContent, fileName)
    //parser.doParse(config)

    var checker = new CssChecker(parser, config)
    checker.prepare();
    return checker
}

function doCompress(fileContent, fileName, config) {
    checker = prepare(fileContent, fileName, config)
    message = checker.doCompress()
    return [checker, message]
}

function compressFile(filePath, config) {
    config = config || defaultConfig
    if (!filePath || !fs.existsSync(filePath)) {
        logger.error('[compress] file not exist: ' + filePath)
        return;
    }

    var extension = config.extension
    if (extension.toLowerCase() == 'none')
        extension = null
    if (extension && endswith(filePath, extension))
        return
    var fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'})
    if (!config.print)
        logger.ok('[compress] compressing ' + filePath)
    var path = filePath
    var basic = filePath.split('.css')[0]
    if (!extension) {
        if (config.noBak === false)
            fs.writeFileSync(path + '.bak', fileContent)
    } else {
        path = filePath.split('.css')[0] + extension
    }

    if (!config.browsers) {
        var result = doCompress(fileContent, filePath, config)
        checker = result[0]
        message = result[1]
        if (config.print) {
            if (extension && fs.existsSync(path)) {
                fs.unlinkSync(path)
            }
            logger.out(message)
        } else {
            fs.writeFileSync(path, message)
            logger.ok('[compress] compressed ==> ' + path)
        }
    } else {
        items = config.browsers
        onlyOne = Object.keys(items).length == 1
        for (var key in items) {
            var value = items[key];
            // 每次都需要一个新的，避免上一次操作后的对象在内存中重复使用导致错误
            // 尤其是合并过的CSS规则集
            checker = prepare(fileContent, filePath, config)
            message = checker.doCompress(value)
            path = filePath.split('.css')[0] + '.' + key + '.min.css'
            if (config.print) {
                if (extension && fs.existsSync(path)) {
                    fs.unlinkSync(path)
                }
                logger.out((onlyOne ? '' : (key + ' : ')) + message)
            } else {
                fs.writeFileSync(path, message)
                logger.ok('[compress] compressed ==> ' + path)
            }
        }
    }
}

function compress(file, config) {
    if (!file || !fs.existsSync(file)) {
        logger.error('[compress] file not exist: ' + file)
        return;
    }
    if (fs.statSync(file).isDirectory()){
        if (config.recursive) {
            compressDirRecursively(file, config)
        } else {
            compressDirSubFiles(file, config)
        }
    } else {
        compressFile(file, config)
    }
}

function compressDir(directory, config) {
    config = config || defaultConfig
    if (config.recursive)
        compressDirRecursively(directory, config)
    else
        compressDirSubFiles(directory, config)
}

function compressDirSubFiles(directory, config) {
    config = config || defaultConfig
    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        compressFile(pathm.join(directory, filename), config)
    });
}

function compressDirRecursively(directory, config) {
    config = config || defaultConfig

    fs.readdirSync(dirname).forEach(function(filename) {
        if ((!endswith(filename, '.css')) || filename.indexOf('_') == 0)
            return
        if (fs.statSync(filename).isDirectory()){
            compressDirRecursively(pathm.join(directory, fileName), config)
            return
        }
        compressFile(pathm.join(directory, filename), config)
    });
}

exports.prepare = prepare

exports.doCompress = doCompress;
exports.compress = compress;
