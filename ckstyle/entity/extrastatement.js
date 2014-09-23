var helper = require('./entityutil');
Cleaner = helper.Cleaner;
var doExtraDetect = require('../browsers/Hacks').doExtraDetect
var ALL = require('../browsers/BinaryRule').ALL

function ExtraStatement(operator, statement, comment, styleSheet) {
    var self = this;
    self.extra = true
    self.nested = false
    self.selector = self.operator = operator.trim()
    self.comment = comment || ''
    self.statement = statement || ''
    self.styleSheet = styleSheet

    self.fixedSelector = ''
    self.fixedStatement = ''

    self.browser = doExtraDetect(self.selector)
    self.toBeUsed = {}
}

ExtraStatement.prototype.isImport = function() {
    var self = this;
    return self.operator == '@import'
}

ExtraStatement.prototype.rebase = function() {
    var self = this;
    self.fixedSelector = ''
    self.fixedStatement = ''
}
    
ExtraStatement.prototype.isOpmOperator = function() {
    var self = this;
    return self.operator.indexOf('@-css-compiler') != -1
}

ExtraStatement.prototype.compress = function(browser) {
    // do not export @-css-compiler to online 
    browser = browser || ALL;
    var self = this;
    if (self.isOpmOperator())
        return ''

    if (!(self.browser & browser))
        return ''
    msg = Cleaner.clean(self.statement)
    if (msg.slice(-1) != '}' && msg.slice(-1) != ';') {
        msg = msg + ';'
    }
    return msg
}

ExtraStatement.prototype.fixed = function(config) {
    var self = this;
    if (self.comment.length == 0) {
        return self.statement.trim()
    } else {
        return self.comment + '\n' + self.statement.trim()
    }
}

ExtraStatement.prototype.toString = function() {
    var self = this;
    return self.statement
}

module.exports = ExtraStatement;