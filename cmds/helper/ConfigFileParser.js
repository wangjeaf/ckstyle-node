var fs = require('fs')
var path = require('path')
var extrapath = require('path-extra')
var ini = require('ini')
var colors = require('colors')
var logger = require('../../ckstyle/logger/index')
var CommandArgs = require('../../ckstyle/command/args').CommandArgs

var FILE_NAMES = 'ckstyle.json ckstyle-config.js ckstyle.ini .ckstyle.json .ckstyle-config.js .ckstyle.ini'.split(' ')

var EXTS = '.json .js .ini'.split(' ')

// 1. get file
    // 1.1 file exists, get it
    // 1.2 else get config from current dir
    // 1.3 else get config from user dir
// 2. parse it
// 3. replace some config of originConfig

exports.loadFileConfig = function(operation, file) {
    var originConfig = new CommandArgs(operation)

    var configFile = file

    if (file) {
        var ext = path.extname(file)
        if (EXTS.indexOf(ext) == -1) {
            logger.error('Config file should end with ' + EXTS.join('/'))
            return originConfig
        }
        if (fs.existsSync(file)) {
            configFile = file
        } else {
            var tmp = path.join(process.cwd(), file)
            if (!fs.existsSync(tmp)) {
                logger.error('Can not find the config file: ' + file)
                return originConfig
            } else {
                configFile = tmp
            }
        }
    }

    if (!configFile) {
        configFile = getConfigFilePath()
    }
    if (!configFile) {
        return originConfig
    }

    var data
    var ext = path.extname(configFile)
    logger.ok('loading config from ' + configFile)
    if (ext == '.ini') {
        data = ini.parse(fs.readFileSync(configFile, 'utf-8'))
    } else {
        try {
            data = require(configFile)
        } catch (e) {
            data = null;
        }
        if (!data) {
           try {
                data = require('./' + configFile)
            } catch (e) {
                data = null;
            } 
        }
        if (!data) {
            logger.error('Can not load config data from: ' + configFile)
        }
    }

    if (data) {
        originConfig.extend(data);
    }

    return originConfig
}

function getConfigFilePath() {
    // homedir: process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
    var dirs = [process.cwd(), extrapath.homedir()]
    var files = FILE_NAMES
    var tmp

    for(var i = 0; i < dirs.length; i++) {
        for(var j = 0; j < files.length; j++) {
            tmp = path.join(dirs[i], files[j])
            if (fs.existsSync(tmp)) {
                return tmp
            }
        }
    }
    return null
}

// if (!module.parent) {
//     var config = exports.loadFileConfig()
//     logger.log(config)
// }