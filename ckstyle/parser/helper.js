function isAlphaChar(char) {
    return char >= 97 && char <= 122
}

specialTexts = [
    {'start':'@', 'text':'@import', 'end':';\n'},
    {'start':'@', 'text':'@charset', 'end':';\n'},
    {'start':'@', 'text':'@namespace', 'end':';'},
    {'start':'@', 'text':'@-css-compiler ', 'end':'}'},
    {'start':'@', 'text':'@-css-compiler{', 'end':'}'},
    {'start':'@', 'text':'@-css-compiler-', 'end':';\n'}]

specialStartChars = [];
for (var i = specialTexts.length - 1; i >= 0; i--) {
    var current = specialTexts[i];
    if (specialStartChars.indexOf(current.start) == -1) {
        specialStartChars.push(current.start);
    }
};

nestedStatements = ['keyframes', '@media', '@-moz-document']

function isSpecialStart(char) {
    for (var i = specialStartChars.length - 1; i >= 0; i--) {
        if (specialStartChars[i] == char) {
            return true;
        }
    }
    return false;
}

function isNestedStatement(selector) {
    if (selector.indexOf('@') == -1) {
        return false
    }
    for (var i = nestedStatements.length - 1; i >= 0; i--) {
        if (selector.indexOf(nestedStatements[i]) != -1)
            return true
    }
    return false;
}

function handleSpecialStatement(text, i, length, char) {
    for(var k = 0; k < specialTexts.length; k++) {
        var obj = specialTexts[k];
        if (char == obj['start'] && isSpecialString(text, i, obj["text"])) {
            tmp = findCharFrom(text, i, length, obj["end"])
            tmp.push(obj["text"])
            return tmp;
        }
    }
    return [null, null, null];
}

function findCharFrom(text, i, length, left, right) {
    right = right || null;
    var counter = 1
    var collector = ''
    for(var j = i + 1; j < length; j++) {
        if (right == null) {
            if (text[j] == left || left.indexOf(text[j]) != -1) {
                break;
            } else {
                collector = collector + text[j]
            }
        } else {
            if (text[j] == left) {
                collector = collector + text[j]
                counter = counter + 1
            } else if (text[j] == right) {
                collector = collector + text[j]
                counter = counter - 1
                if (counter == 0) {
                    break;
                }
            } else {
                collector = collector + text[j]
            }
        }
    }
    return [j, collector]
}

function isSpecialString(text, i, string) {
    return text.substring(i, i + string.length) == string
}

function isCommentStart(char, text, i) {
    return char == '/' && i + 1 < text.length && text[i + 1] == '*'
}

function isCommentEnd(char, text, i) {
    return char == '/' && text[i - 1] == '*'
}

exports.isCommentStart = isCommentStart;
exports.isCommentEnd = isCommentEnd;
exports.isSpecialString = isSpecialString;
exports.findCharFrom = findCharFrom;
exports.isAlphaChar = isAlphaChar;
exports.isSpecialStart = isSpecialStart;
exports.isNestedStatement = isNestedStatement;
exports.handleSpecialStatement = handleSpecialStatement;