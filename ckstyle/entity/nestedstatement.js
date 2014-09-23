var helper = require('./entityutil');
Cleaner = helper.Cleaner;
var doExtraDetect = require('../browsers/Hacks').doExtraDetect
var ALL = require('../browsers/BinaryRule').ALL

function NestedStatement(selector, statement, comments, styleSheet) {
    var self = this;
    self.extra = true
    self.nested = true
    self.selector = Cleaner.clearSelector(selector)
    self.statement = statement.trim()
    self.roughStatement = statement
    self.roughSelector = selector
    self.comments = comments.trim()
    self.styleSheet = styleSheet

    self.fixedSelector = ''
    self.fixedStatement = ''

    self.compressedStatement = ''

    self.browser = doExtraDetect(self.selector)
    self.toBeUsed = {}

    self.innerStyleSheet = null
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
    var value = self._compressedStatement(browser);
    if (value == '{}') {
        return ''
    }
    return self.fixedSelector + value
}

NestedStatement.prototype.fixed = function(config) {
    var self = this;
    self.fixedSelector = self.fixedSelector || self.selector
    self.fixedSelector = Cleaner.clean(self.fixedSelector);
    if (!self.fixedStatement && self.innerStyleSheet) {
        self.fixedStatement = self.innerStyleSheet.fixed(config)
    }
    self.fixedStatement = self.fixedStatement || self.statement
    return self.fixedSelector + ' {\n    ' + self.fixedStatement.split('\n').join('\n    ') + '\n}'
}
NestedStatement.prototype._compressedStatement = function(browser) {
    var self = this;
    var stmt = self.compressedStatement
    if (!stmt) {
        stmt = Cleaner.clean(self.fixedStatement);
        if (self.innerStyleSheet) {
            stmt = self.innerStyleSheet.compress(browser)
        }
    } 
    return '{' + stmt + '}'
}
NestedStatement.prototype.toString = function () {
    var self = this;
    return self.statement
}

module.exports = NestedStatement;