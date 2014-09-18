var ALL = require('../browsers/BinaryRule').ALL

var Cleaner = {};

Cleaner.clean = function(msg) {
    msg = msg.trim().replace('\r', '').replace('\n', '').replace('    ', ' ')
    msg = msg.replace(/\s*\{\s*/g, '{'); 
    msg = msg.replace(/\s*:\s*/g, ':'); 
    msg = msg.replace(/\s*;\s*\}\s*/g, '}');
    msg = msg.replace(/\s*;\s*/g, ';')
    msg = msg.replace(/\s\s+/g, ' ')
    msg = msg.replace(/\(\s*/g, '(')
    msg = msg.replace(/\s+\)/g, ')')
    msg = msg.replace(/\s+,/g, ',')
    msg = msg.replace(/,\s+/g, ',')
    msg = msg.replace(/(\.[0-9]*[1-9])0*([a-zA-Z]*)/g, function(a, b, c) {
        return b + c;
    })
    msg = msg.trim()
    return msg
}

Cleaner.clearName = function(name) {
    name = name.trim()
    // #padding: 10px???
    if (name.indexOf('_') == 0 || name.indexOf('*') == 0 || name.indexOf('+') == 0 || name.indexOf('#') == 0) {
        name = name.substring(1);
    }
    if (name.indexOf('-') == 0) {
        if (name.indexOf('-moz-') == 0
            || name.indexOf('-webkit-') == 0 
            || name.indexOf('-ms-') == 0 
            || name.indexOf('-o-') == 0
            || name.indexOf('-khtml-') == 0)
            name = name.split('-').slice(2).join('-');
    }
    return name.toLowerCase()
}

Cleaner.clearValue = function(value) {
    value = value.trim()
    if (value.slice(-1) == ';')
        value = value.slice(0, -1);
    return value
}

Cleaner.clearValues = function(values) {
    values = values.trim()
    return values
}

Cleaner.clearSelector = function(selector) {
    return selector.split('\n').join(' ').trim()
}

Cleaner.clearComment = function(comment) {
    comment = comment.trim()
    if (comment.length != 0 && comment.indexOf('\n') == -1) {
        comment = comment.replace(/\/\*/g, '').replace(/\*\//g, '').trim()
        comment = '/* ' + comment + ' */'
    }
    return comment
}

exports.Cleaner = Cleaner;