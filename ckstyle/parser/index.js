var StyleSheet = require('../entity/index').StyleSheet;

var helper = require('./helper');
findCharFrom = helper.findCharFrom;
handleSpecialStatement = helper.handleSpecialStatement;
isCommentStart = helper.isCommentStart;
isCommentEnd = helper.isCommentEnd
isSpecialStart = helper.isSpecialStart
isNestedStatement = helper.isNestedStatement;

function CSSParser(css, fileName, config) {
    this.reset(css, fileName, config);
}

CSSParser.prototype.reset = function(css, fileName, config) {
    this.roughCss = css;
    this.fileName = fileName;
    this.totalLength = css.length;
    this.styleSheet = new StyleSheet(fileName);
    this._parseErrors = [];
};

CSSParser.prototype.doParse = function(config) {
    var self = this;
    config = config || {};
    if (self.totalLength == 0) {
        return;
    }
    var prevChar = null, inComment = false, length = self.totalLength,
        text = self.roughCss, selector = '', commentText = '', charIndex = -1 , 
        comments = [], char
    var realComment;
    while (true) {
        if (charIndex >= length - 1) {
            break;
        }
        charIndex = charIndex + 1
        char = text[charIndex]
        if (!inComment && isCommentStart(char, text, charIndex)) {
            commentText = ''
            inComment = true
        }
        if (isCommentEnd(char, text, charIndex)) {
            commentText = commentText + char
            inComment = false
            comments.push(commentText)
            commentText = ''
            continue
        }
        if (inComment) {
            commentText = commentText + char
            continue;
        }
        if (isSpecialStart(char)) {
            var tmp = handleSpecialStatement(text, charIndex, length, char);
            var nextPos = tmp[0];
            var attrs = tmp[1];
            var operator = tmp[2];
            if (nextPos !== null) {
                realComment = ''
                if (comments.length != 0) {
                    realComment = comments.join('\n')
                    comments = []
                }
                self.styleSheet.addExtraStatement(operator, char + attrs + text[nextPos], realComment)
                charIndex = nextPos
                selector = ''
                commentText = ''
                comments = []
                continue
            }
        }

        if (char == '{') {
            var tmp = findCharFrom(text, charIndex, length, '{', '}');
            var nextBracePos = tmp[0];
            var attributes = tmp[1];
            // do not need the last brace
            var realComment = ''
            if (comments.length != 0) {
                realComment = comments.join('\n')
                comments = []
            }
            if (isNestedStatement(selector)) {
                var nestedCss = attributes
                // remove end '}'
                nestedCss = nestedCss.slice(0, -1)
                var stmt = self.styleSheet.addNestedRuleSet(selector, nestedCss, realComment)
                parseNestedStatment(stmt, nestedCss, this.fileName, this.config)
            } else {
                self.styleSheet.addRuleSetByStr(selector, attributes.slice(0, -1), realComment)
            }
            commentText = ''
            charIndex = nextBracePos
            selector = ''
        } else if (char == '}') {
            selector = ''
        } else {
            selector = selector + char
        }
    }
        
    function parseNestedStatment(stmt, nestedCss, fileName, config) {
        var innerParser = new CSSParser(nestedCss, fileName, config)
        innerParser.doParse(config)
        stmt.innerStyleSheet = innerParser.styleSheet
    }

    self.styleSheet.getRuleSets().forEach(function(ruleSet) {
        var errors = self.doParseRules(ruleSet)
        self._parseErrors = self._parseErrors.concat(errors);
    })
};

CSSParser.prototype.getParseErrors = function () {
    return this._parseErrors
};

CSSParser.prototype.doParseRules = function(ruleSet) {
    var errors = []
    if (ruleSet.extra) {
        return errors
    }
    var text = ruleSet.roughValue
    var singleLine = text.split('\n').length == 1
    var selector = ruleSet.selector.trim()
    var i = -1
    var length = text.length
    var inComment = false
    var collector = ''
    var attr = ''
    var value = ''
    var valueStarted = false
    while (true) {
        if (i == length - 1)
            break;
        i = i + 1
        char = text[i]
        if (!valueStarted && isCommentStart(char, text, i)) {
            inComment = true
            //errors.push([-1, 'find comment in values of "%s"' % selector])
            collector = ''
        }
        if (!valueStarted && isCommentEnd(char, text, i)) {
            collector = ''
            inComment = false
            continue
        }
        if (!valueStarted && inComment) {
            continue
        }
        if (char == ':') {
            if (valueStarted) {
                collector = collector + char
            } else {
                valueStarted = true
                attr = collector
                collector = ''
            }
        } else if (char == ';' || char == '\n' || i == length - 1) {
            valueStarted = false
            if (attr == '') {
                collector = ''
                continue
            }
            value = collector + char
            // no value yet
            if (value.trim().length == 0) {
                continue;
            }
            // not over yet
            if (value.trim().slice(-1) == ',') {
                continue;
            }
            ruleSet.addRuleByStr(attr, value)
            attr = ''
            value = ''
            collector = ''
        } else if (char == '{') {
            var tmp = findCharFrom(text, i, length, '{', '}');
            nextBracePos = tmp[0];
            attributes = tmp[1]; 
            collector = collector + char + attributes
            i = nextBracePos
        } else if (char == '}') {
            collector = collector + char
        } else if (char == '(') {
            var tmp = findCharFrom(text, i, length, '(', ')');
            nextBracePos = tmp[0];
            attributes = tmp[1];
            collector = collector + char + attributes
            i = nextBracePos
            if (i == length - 1) {
                ruleSet.addRuleByStr(attr, collector)
                break;
            }
        } else {
            collector = collector + char
        }
    }
    return errors
};

exports.CSSParser = CSSParser;

// if (!module.parent) {
//     text = '/*fdsafdas*/.publisher-c .global-publisher-selector{ top:5px;}\
//  .publisher-a .global-publisher-selector-status a,\
//  .publisher-a .global-publisher-selector-status .global-publisher-status-trigger:hover,\
//  .publisher-a .global-publisher-selector .active .global-publisher-status-trigger {\
//     background-position: 0 1px;\
// }\
//  .publisher-a .global-publisher-selector-share a,\
//  .publisher-a .global-publisher-selector-share a:hover,\
//  .publisher-a .global-publisher-selector .active .global-publisher-share-trigger{\
//     background-position: 0 -48px;\
//  }'
//     var parser = new CSSParser(text)
//     parser.doParse();
//     console.log(parser.styleSheet.getRuleSets()[0]);
// }