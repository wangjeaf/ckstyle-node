var fs = require('fs');
var pathm = require('path');

var CssParser = require('./parser/index').CSSParser
var CssChecker = require('./ckstyler').CssChecker
var args = require('./command/args');

var defaultConfig = new args.CommandArgs()

function endswith(filename, extname) {
    return filename.indexOf(extname) == filename.length - extname.length;
}

function doFix(fileContent, fileName, config) {
    fileName = fileName || ''
    config = config || defaultConfig

    config.operation = 'fixstyle'
    parser = new CssParser(fileContent, fileName)
    //parser.doParse(config)

    checker = new CssChecker(parser, config)
    checker.prepare();
    //checker.loadPlugins(os.path.realpath(os.path.join(__file__, '../plugins')))
    var fixed = checker.doFix()

    return [checker, fixed]
}

function fixFile(filePath, config) {
    config = config || defaultConfig

    extension = config.fixedExtension
    if (extension.toLowerCase() == 'none')
        extension = null
    if (extension != null && endswith(filePath, extension))
        return
    fileContent = fs.readFileSync(filePath, {encoding: 'utf-8'})
    if (!config.printFlag)
        console.log('[fixstyle] fixing ' + filePath)

    var result = doFix(fileContent, filePath, config)
    checker = result[0]
    msg = result[1]

    path = filePath
    if (extension == null) {
        if (!config.noBak)
            fs.writeFileSync(path + '.bak', fileContent)
    } else {
        path = filePath.split('.css')[0] + extension
    }

    if (config.printFlag) {
        if (extension && fs.existsSync(path)) {
            fs.unlinkSync(path)
        }
        console.log(msg)
    } else {
        fs.writeFileSync(path, msg)
        console.log('[fixstyle] fixed ==> ' + path)
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
    // for dirpath, dirnames, filenames in os.walk(directory):
    //     for filename in filenames:
    //         if not filename.endswith('.css') or filename.startswith('_'):
    //             continue
    //         checkFile(os.path.join(dirpath, filename), config)
}

exports.doFix = doFix;