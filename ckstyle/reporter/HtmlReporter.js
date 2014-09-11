var fill = require('./helper').fill;
var Class = require('../base').Class;

function len(arr) {
    return arr.length;
}

var HttpReporter = new Class(function() {
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
            // self.appendMsg('msg', {
            //     code: 200,
            //     msg: 'aha, no problem'
            // })
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

    this._toHTML = function(self, type, arr, html) {
        if (arr.length) {
            html.push('<div class="' + type.toLowerCase() + '">\n')
            html.push('  <h2>' + type + '</h2>\n');
            html.push('  <ol>\n')
            arr.forEach(function(msg) {
                html.push('    <li>' + msg + '</li>\n')
            })
            html.push('  </ol>\n')
            html.push('</div>\n')
        }
    }

    this.export = function(self) {
        var html = [];
        self._toHTML('MSG', self.msgs, html)
        self._toHTML('ERROR', self.errors, html)
        self._toHTML('WARN', self.warnings, html)
        self._toHTML('LOG', self.logs, html)
        return html.join('')
    }
});

module.exports = HttpReporter;