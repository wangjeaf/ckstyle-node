var fill = require('./helper').fill;
var Class = require('../base').Class;

function len(arr) {
    return arr.length;
}

var TextReporter = new Class(function() {
    this.__init__ = function(self, checker) {
        self.checker = checker
        self.msgs = []
    }

    this.doReport = function(self) {
        checker = self.checker
        counter = 0

        var result = checker.errors()
        logs = result[0]
        warns = result[1]
        errors = result[2]

        if (len(logs) == 0 && len(warns) == 0 && len(errors) == 0) {
            // self.appendMsg('aha, no problem')
            return
        }

        errors.forEach(function(error) {
            counter = counter + 1
            self.appendMsg('[ERROR] ' + counter + '. ' + fill(error))
        })

        warns.forEach(function(warn) {
            counter = counter + 1
            self.appendMsg(' [WARN] ' + counter + '. ' + fill(warn))
        })

        logs.forEach(function(log) {
            counter = counter + 1
            self.appendMsg('  [LOG] ' + counter + '. ' + fill(log))
        })
    }

    this.appendMsg = function(self, msg) {
        self.msgs.push(msg)
    }

    this.export = function(self) {
        return self.msgs.join('\n')
    }
});

module.exports = TextReporter;