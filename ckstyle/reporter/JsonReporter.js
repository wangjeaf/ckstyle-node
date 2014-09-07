var fill = require('./helper').fill;
var Class = require('../base').Class;

function len(arr) {
    return arr.length;
}

var TextReporter = new Class(function() {
    this.__init__ = function(self, checker) {
        self.checker = checker
        self.msgs = []
        self.logs = []
        self.errors = []
        self.warnings = []
    }

    this.doReport = function(self) {
        checker = self.checker
        counter = 0

        var result = checker.errors()
        logs = result[0]
        warns = result[1]
        errors = result[2]

        if (len(logs) == 0 && len(warns) == 0 && len(errors) == 0) {
            self.appendMsg('msg', {
                code: 200,
                msg: 'aha, no problem'
            })
            return
        }

        errors.forEach(function(error) {
            counter = counter + 1
            self.appendMsg('error', fill(error))
        })

        warns.forEach(function(warn) {
            counter = counter + 1
            self.appendMsg('warning', fill(warn))
        })

        logs.forEach(function(log) {
            counter = counter + 1
            self.appendMsg('log', fill(log))
        })
    }

    this.appendMsg = function(self, type, msg) {
        if (type == 'msg') {
            self.msgs.push(msg)
        }
        if (type == 'log') {
            self.logs.push(msg)
        }
        if (type == 'error') {
            self.errors.push(msg)
        }
        if (type == 'warning') {
            self.warnings.push(msg)
        }
    }

    this.export = function(self) {
        return JSON.stringify({
            msgs: self.msgs,
            warnings: self.warnings,
            logs: self.logs,
            errors: self.errors
        })
    }
});

module.exports = TextReporter;