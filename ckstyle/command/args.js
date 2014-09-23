var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class

var analyse = require('../browsers/Analyser').analyse

var EXTS = {
    check: '.ckstyle.txt',
    fix: '.fixed.css',
    format: '.fmt.css',
    compress: '.min.css'
}

var CommandArgs = new Class(function() {

    this.__init__ = function(self, operation) {

        self.operation = operation || 'check'

        self.errorLevel = 2
        self.recursive = false
        // self.print = true
        self.output = ''
        self.include = 'all'
        self.exclude = 'none'
        self.config = ''

        // self.extension = EXTS[self.operation] || '.ckstyle.txt'

        self.standard = ''
        self.json = false
        self.ignoreRulesets = ['@unit-test-expecteds']
        self.singleLine = false
        self.safe = false

        self.combine = true
        self.browsers = null
        // self.noBak = false

        // for CKStyle inner use
        self._inner = {
            curBrowser: null
        }

        // plugin config for developers, add plugin section in ckstyle.ini
        // 
        // [plugin]
        // pluginA = 1
        self._pluginConfigs = {}
    }

    this.extend = function(self, config) {
        // load configs i need.
        for(var prop in self) {
            if (prop == 'parent') {
                continue
            }
            if (config.hasOwnProperty(prop)) {
                if (prop == 'browsers') {
                    self[prop] = analyse(config[prop])
                    continue
                }
                self[prop] = config[prop]
            }
        }
    }

    this.toString = function(self) {
        var collector = []
        for(var prop in self) {
            collector.push(prop + ': ' + self[prop])
        }
        return collector.join(', ')
    }
});

exports.CommandArgs = CommandArgs
