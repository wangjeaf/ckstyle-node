var helper = require('./entityutil');
var Cleaner = helper.Cleaner;
var doRuleSetDetect = require('../browsers/Hacks').doRuleSetDetect
var ALL = require('../browsers/BinaryRule').ALL

var Rule = require('./rule');

function RuleSet(selector, values, comment, styleSheet) {
    var self = this;
    self.extra = false
    self.roughSelector = selector
    self.roughValue = values
    self.roughComment = comment

    self.selector = Cleaner.clearSelector(selector)
    self.values = Cleaner.clearValues(values)
    self.comment = Cleaner.clearComment(comment)

    self.fixedSelector = ''
    self.fixedComment = ''

    self.styleSheet = styleSheet
    self._rules = []

    self.singleLineFlag = (self.roughValue.split('\n').length == 1)

    self.browser = doRuleSetDetect(self.roughSelector)
    self.toBeUsed = {}
}


RuleSet.prototype.rebase = function() {
    var self = this;
    self.fixedSelector = ''
    self.fixedComment = ''
}

RuleSet.prototype.extendSelector = function(other) {
    var self = this;
    var splited = [];
    var selectors = self.selector.split(',');
    for(var i = 0; i < selectors.length; i++) {
        if (selectors[i].trim() != '') {
            splited.push(selectors[i].trim());
        }
    }
    var otherSplited = [];
    var selectors = other.selector.split(',');
    for(var i = 0; i < selectors.length; i++) {
        if (selectors[i].trim() != '') {
            otherSplited.push(selectors[i].trim());
        }
    }

    otherSplited.forEach(function(x) {
        if (splited.indexOf(x) == -1) {
            self.selector = self.selector + ', ' + x
            self.roughSelector = self.roughSelector + ', ' + x
            self.fixedSelector = self.fixedSelector + ',' + x
        }
    });

    if (other.comment.length != 0 && self.comment.indexOf(other.comment) == -1) {
        // do not need duplicated comment
        self.roughComment = self.roughComment + ('\n' + other.roughComment)
        self.comment = self.comment + '\n' + other.comment
        self.fixedComment = self.fixedComment + '\n' + other.fixedComment
    }
}

RuleSet.prototype.compressRules = function(browser) {
    var self = this;
    browser = browser || ALL;
    var collector = []
    self._rules.forEach(function(rule) {
        compressed = rule.compress(browser)
        if (compressed != '') {
            collector.push(compressed)
        }
    });
    var collected = collector.join('')
    if (collected != '') {
        collected = collected.slice(0, -1)
    }
    return collected
}

RuleSet.prototype.compress = function(browser) {
    var self = this;
    browser = browser || ALL;
    if (!self.browser) {
        return '';
    }
    if (!(self.browser & browser))
        return ''
    var result = self.fixedSelector || self.selector;
    if (result.indexOf(',') != -1) {
        // remove duplicated selectors
        var selectors = []
        var splited = result.split(',');
        splited.forEach(function(x) {
            x = x.trim()
            if (selectors.indexOf(x) != -1) {
                return;
            }
            selectors.push(x)
        })
        result = selectors.join(',');
    }
    var compressed = self.compressRules(browser)
    if (compressed == '')
        return ''
    result = result + '{' + compressed + '}'
    return result
}

RuleSet.prototype.fixedRules = function(config) {
    var self = this;
    var collector = []
    var spaces = '    '
    var seperator = '\n'
    if (config && config.fixToSingleLine) {
        spaces = ''
        seperator = ' '
    }
    self._rules.forEach(function(rule) {
        collector.push(spaces + rule.fixed())
    })
    var collected = collector.join(seperator)
    return collected
}

RuleSet.prototype.fixed = function(config) {
    var self = this;
    var comment = self.fixedComment || self.comment
    var selector = self.fixedSelector || self.selector
    if (selector.indexOf(',') != -1) {
        // remove duplicated selectors
        selectors = []
        selector.split(',').forEach(function(x) {
            x = x.trim()
            if (selectors.indexOf(x) != -1)
                return;
            selectors.push(x)
        })
        selector = selectors.join(',\n')
    }
    var seperator = '\n'
    if (config && config.fixToSingleLine) {
        seperator = ' '
    }
    var result = selector + ' {' + seperator + self.fixedRules(config) + seperator + '}'
    if (comment != '') {
        result = comment + '\n' + result
    }
    return result
}

RuleSet.prototype.getSingleLineFlag = function() {
    var self = this;
    return self.singleLineFlag
}

RuleSet.prototype.getStyleSheet = function() {
    var self = this;
    return self.styleSheet
}

RuleSet.prototype.addRuleByStr = function(selector, attr, value) {
    var self = this;
    self._rules.push(new Rule(selector, attr, value, self))
}
RuleSet.prototype.indexOf = function(name) {
    var self = this;
    var counter = 0
    name = name.trim();
    for(var i = 0; i < self._rules.length; i++) {
        var rule = self._rules[i];
        if (rule.roughName.trim() == name) {
            return counter
        }
        counter = counter + 1
    }
    return -1
}
RuleSet.prototype.removeRuleByIndex = function(index) {
    var self = this;
    if (index < self._rules.length) {
        self._rules[index] = null;
    }
}
RuleSet.prototype.clean = function() {
    var self = this;
    var newRules = []
    self._rules.forEach(function(rule) {
        if (!rule) {
            return;
        }
        newRules.push(rule)
    })
    self._rules = newRules
}
RuleSet.prototype.existNames = function(name) {
    var self = this, names;
    if (name.indexOf(',') != -1) {
        names = name.split(',')
    } else {
        names = [name]
    }
    for(var i = 0; i < names.length; i++) {
        var name = names[i];
        name = name.trim()
        for(var j = 0; j < self._rules.length; j++) {
            var rule = self._rules[j]
            if (rule.name == name) {
                return true;
            }
        }
    }
    return false
}

RuleSet.prototype.existRoughNames = function(name) {
    var self = this, names;
    if (name.indexOf(',') != -1) {
        names = name.split(',')
    } else {
        names = [name]
    }
    for(var i = 0; i < names.length; i++) {
        var name = names[i];
        name = name.trim()
        for(var j = 0; j < self._rules.length; j++) {
            var rule = self._rules[j]
            if (rule.strippedName == name) {
                return true;
            }
        }
    }
    return false
}
RuleSet.prototype.getRuleByStrippedName = function(name) {
    var self = this;
    for(var i = 0; i < self._rules.length; i++) {
        var rule = self._rules[i];
        if (rule.strippedName == name) {
            return rule
        }
    }
}
RuleSet.prototype.getRuleByRoughName = function(name) {
    var self = this;
    for(var i = 0; i < self._rules.length; i++) {
        var rule = self._rules[i];
        if (rule.roughName == name) {
            return rule
        }
    }
}
RuleSet.prototype.getRuleByName = function(name) {
    if (!name) {
        return;
    }
    var self = this;
    for(var i = 0; i < self._rules.length; i++) {
        var rule = self._rules[i];
        if (rule.name == name) {
            return rule
        }
    }
}
RuleSet.prototype.getRules = function() {
    var self = this;
    return self._rules
}
RuleSet.prototype.setRules = function(newRules) {
    var self = this;
    self._rules = newRules
}
RuleSet.prototype.toString = function() {
    var self = this;
    return self.selector + ' {' + self.roughValue + '}';
}

module.exports = RuleSet;