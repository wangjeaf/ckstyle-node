var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class

var CommandArgs = new Class(function() {
    this.__init__ = function(self) {
        self.operation = null
        self.errorLevel = 2
        self.recursive = false
        self.printFlag = false
        self.extension = '.ckstyle.txt'
        self.include = 'all'
        self.exclude = 'none'
        self.standard = ''
        self.exportJson = false
        self.ignoreRuleSets = ['@unit-test-expecteds']
        self.fixedExtension = '.fixed.css'
        self.fixToSingleLine = false
        self.compressConfig = CompressArgs()
        self.safeMode = false
        self.noBak = false

        self._curBrowser = null

        // plugin config for developers, add plugin section in ckstyle.ini
        // 
        // [plugin]
        // pluginA = 1
        self.pluginConfig = {}
    }

    this.toString = function(self) {
        return 'errorLevel: ' + self.errorLevel + 
            '\n recursive: ' + self.recursive + 
            '\n printFlag: ' + self.printFlag + 
            '\n extension: ' + self.extension + 
            '\n include: ' + self.include +
            '\n exclude: ' + self.exclude
    }
});

var CompressArgs = new Class(function() {
    this.__init__ = function(self) {
        self.extension = '.min.css'
        self.combineFile = true
        self.browsers = null
        self.noBak = false
    }

    this.toString = function(self) {
        return 'extension: ' + self.extension + 
            ', combineFile: ' + self.combineFile + 
            ', browsers: ' + self.browsers
    }
})

exports.CommandArgs = CommandArgs
exports.CompressArgs = CompressArgs
