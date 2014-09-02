var helper = require('./entityutil');
Cleaner = helper.Cleaner;
var doExtraDetect = require('../browsers/Hacks').doExtraDetect
var ALL = require('../browsers/BinaryRule').ALL

function NestedStatement(selector, statement, comments, styleSheet) {
    var self = this;
    self.extra = true
    self.nested = true
    self.selector = selector.trim()
    self.statement = statement.trim()
    self.roughStatement = statement
    self.comments = comments.trim()
    self.styleSheet = styleSheet

    self.fixedSelector = ''
    self.fixedStatement = ''

    self.browser = doExtraDetect(self.selector)
    self.toBeUsed = {}
}

NestedStatement.prototype.rebase = function() {
    var self = this;
    self.fixedSelector = ''
    self.fixedStatement = ''
}

NestedStatement.prototype.compress = function(browser) {
    browser = browser || ALL;
    var self = this;
    if (!(self.browser & browser))
        return ''
    return self.fixedSelector + self._compressedStatement()
}

NestedStatement.prototype.fixed = function(config) {
    var self = this;
    return self.fixedSelector + ' {\n    ' + self.fixedStatement.split('\n').join('\n    ') + '\n}'
}
NestedStatement.prototype._compressedStatement = function() {
    var self = this;
    return '{' + Cleaner.clean(self.fixedStatement) + '}'
}
NestedStatement.prototype.toString = function () {
    var self = this;
    return self.statement
}

module.exports = NestedStatement;