var fs = require('fs');
var pathm = require('path');

var CssParser = require('./parser/index').CSSParser
var CssChecker = require('./ckstyler').CssChecker
var args = require('./command/args');

var defaultConfig = new args.CommandArgs()

function endswith(filename, extname) {
    return filename.indexOf(extname) == filename.length - extname.length;
}

function prepare(fileContent, fileName, config) {
    fileName = fileName || ''
    config = config || defaultConfig
    config.operation = 'compress'

    parser = new CssParser(fileContent, fileName)
    //parser.doParse(config)

    checker = new CssChecker(parser, config)
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
    extension = config.compressConfig.extension
    if (extension.toLowerCase() == 'none')
        extension = null
    if (extension && endswith(filePath, extension))
        return
    fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'})
    if (!config.printFlag)
        console.log('[compress] compressing ' + filePath)
    path = filePath
    basic = filePath.split('.css')[0]
    if (!extension)
        if (config.compressConfig.noBak === false)
            fs.writeFileSync(path + '.bak', fileContent)
    else
        path = filePath.split('.css')[0] + extension
        
    if (!config.compressConfig.browsers) {
        var result = doCompress(fileContent, filePath, config)
        checker = result[0]
        message = result[1]
        if (config.printFlag) {
            if (extension && fs.existsSync(path)) {
                fs.unlinkSync(path)
            }
            console.log(message)
        } else {
            fs.writeFileSync(path, message)
            console.show('[compress] compressed ==> ' + path)
        }
    } else {
        items = config.compressConfig.browsers
        onlyOne = Object.keys(items).length == 1
        for (var key in items) {
            var value = items[key];
            // 每次都需要一个新的，避免上一次操作后的对象在内存中重复使用导致错误
            // 尤其是合并过的CSS规则集
            checker = prepare(fileContent, filePath, config)
            message = checker.doCompress(value)
            path = os.path.realpath(filePath.split('.css')[0] + '.' + key + '.min.css')
            if (config.printFlag) {
                if (extension && fs.existsSync(path)) {
                    fs.unlinkSync(path)
                }
                console.log((onlyOne ? '' : (key + ' : ')) + message)
            } else {
                fs.writeFileSync(path, message)
                console.show('[compress] compressed ==> ' + path)
            }
        }
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
    // for dirpath, dirnames, filenames in os.walk(directory):
    //     for filename in filenames:
    //         if not filename.endswith('.css') or filename.startswith('_'):
    //             continue
    //         checkFile(os.path.join(dirpath, filename), config)
}

exports.doCompress = doCompress;
exports.prepare = prepare