var RuleSet = require('./ruleset');
var ExtraStatement = require('./extrastatement');
var NestedStatement = require('./nestedstatement');
var EntityUtil = require('./entityutil');

function StyleSheet(fileName) {
    this._ruleSets = [];
    this._file = fileName || '';
    //self.browser = ALL
    this.toBeUsed = {};
}

StyleSheet.prototype.addRuleSetByStr = function(selector, attrs, comment) {
    this._ruleSets.push(new RuleSet(selector, attrs, comment, this))
};

StyleSheet.prototype.addExtraStatement = function(operator, statement, comment) {
    this._ruleSets.push(new ExtraStatement(operator, statement, comment, this))
};

StyleSheet.prototype.addNestedRuleSet = function(selector, attrs, comment) {
    this._ruleSets.push(new NestedStatement(selector, attrs, comment, this))
};

StyleSheet.prototype.setFile = function(fileName) {
    this._file = fileName
};

StyleSheet.prototype.getFile = function() {
    var self = this;
    return this._file
};

StyleSheet.prototype.getRuleSets = function() {
    var self = this;
    return self._ruleSets
};

StyleSheet.prototype.removeRuleSetByIndex = function(index) {
    var self = this;
    self._ruleSets[index] = null
};

StyleSheet.prototype.removeRuleSet = function(ruleSet) {
    var self = this;
    var newRuleSets = []
    for(var i = 0; i < this._ruleSets.length; i ++) {
        x = this._ruleSets[i];
        if (x == ruleSet) {
            continue
        }
        newRuleSets.push(x)
    }
    this._ruleSets = newRuleSets;
};

StyleSheet.prototype.clean = function() {
    var self = this;
    var newRuleSets = []
    for(var i = 0; i < this._ruleSets.length; i ++) {
        x = this._ruleSets[i];
        if (x == null) {
            continue
        }
        newRuleSets.push(x)
    }
    this._ruleSets = newRuleSets
};

StyleSheet.prototype.getRuleSetBySelector = function(selector) {
    var self = this;
    for(var i = 0; i < this._ruleSets.length; i ++) {
        ruleSet = this._ruleSets[i];
        if (ruleSet.selector == selector) {
            return ruleSet
        }
    }
};

StyleSheet.prototype.compress = function(browser) {
    browser = browser || ALL;
    var self = this;
    var result = []
    for(var i = 0; i < this._ruleSets.length; i ++) {
        ruleSet = this._ruleSets[i];
        if (ruleSet.browser && !(ruleSet.browser & browser)) {
            continue
        }
        result.push(ruleSet.compress(browser))
    }
    return result.join('')
};

StyleSheet.prototype.fixed = function(config) {
    var self = this;
    var result = []
    for(var i = 0; i < this._ruleSets.length; i ++) {
        ruleSet = this._ruleSets[i];
        result.push(ruleSet.fixed(config))
    }
    return result.join('\n\n')
};

StyleSheet.prototype.rebase = function() {
    var self = this;
    self._ruleSets.forEach(function(ruleSet) {
        ruleSet.rebase()
    });
};

module.exports = StyleSheet;