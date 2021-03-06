function containsHack(name, strippedName, value) {
    return value.indexOf('\\9') != -1
}

exports.calc = function(str) {
    if (!str) {
        return str;
    }
    if (str.indexOf('calc') != -1) {
        return str.replace(/\s*([+-])\s*/g, '$1')
    }
    return str;
}

exports.uncalc = function(str) {
    if (!str) {
        return str;
    }
    if (str.indexOf('calc') != -1) {
        return str.replace(/\s*([+-])\s*/g, ' $1 ')
    }
    return str;
}

var canBeCombinedProps = {
    'border-radius': [
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-right-radius',
        'border-bottom-left-radius'
    ],
    'border-radius': [
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-right-radius',
        'border-bottom-left-radius'
    ],
    'list-style': [
        'list-style-image',
        'list-style-position',
        'list-style-type'
    ],
    'border-top': ['border-top-width', 'border-top-style', 'border-top-color'],
    'border-bottom': ['border-bottom-width', 'border-bottom-style', 'border-bottom-color'],
    'border-left': ['border-left-width', 'border-left-style', 'border-left-color'],
    'border-right': ['border-right-width', 'border-right-style', 'border-right-color'],
    
    transition: [
        'transition-property',
        'transition-duration',
        'transition-timing-function',
        'transition-delay'
    ],
    '-webkit-transition': [
        '-webkit-transition-property',
        '-webkit-transition-duration',
        '-webkit-transition-timing-function',
        '-webkit-transition-delay'
    ],
    '-moz-transition': [
        '-moz-transition-property',
        '-moz-transition-duration',
        '-moz-transition-timing-function',
        '-moz-transition-delay'
    ],
    '-o-transition': [
        '-o-transition-property',
        '-o-transition-duration',
        '-o-transition-timing-function',
        '-o-transition-delay'
    ],
    animation: [
        'animation-property',
        'animation-duration',
        'animation-timing-function',
        'animation-delay',
        'animation-iteration-count',
        'animation-direction'
    ],
    '-webkit-animation': [
        '-webkit-animation-property',
        '-webkit-animation-duration',
        '-webkit-animation-timing-function',
        '-webkit-animation-delay',
        '-webkit-animation-iteration-count',
        '-webkit-animation-direction'
    ],
    '-moz-animation': [
        '-moz-animation-property',
        '-moz-animation-duration',
        '-moz-animation-timing-function',
        '-moz-animation-delay',
        '-moz-animation-iteration-count',
        '-moz-animation-direction'
    ],
    '-o-animation': [
        '-o-animation-property',
        '-o-animation-duration',
        '-o-animation-timing-function',
        '-o-animation-delay',
        '-o-animation-iteration-count',
        '-o-animation-direction'
    ],
    background: [
        "background-color",
        "background-image",
        "background-repeat",
        "background-attachment",
        "background-position",
        "background-position-x",
        "background-position-y"
    ],
    border: [
        'border-width', 
        'border-style', 
        'border-color'
    ],
    outline: [
        'outline-width', 
        'outline-style', 
        'outline-color'
    ],
    margin: [
        'margin-top', 
        'margin-right', 
        'margin-bottom', 
        'margin-left'
    ],
    padding: [
        'padding-top', 
        'padding-right', 
        'padding-bottom', 
        'padding-left'
    ],
    background: [
        'background-color', 
        'background-image', 
        'background-repeat', 
        'background-attachment', 
        'background-position'
    ],
    font: [
        'font-style',
        'font-variant',
        'font-weight',
        'font-size', 
        'font-family',
        'line-height'
    ]
}

function canBeCombined(prop) {
    prop = prop.trim()
    for(var x in canBeCombinedProps) {
        if (prop == x || prop.indexOf(x) == 0 || canBeCombinedProps[x].indexOf(prop) != -1) {
            return x;
        }
    }
    return null;
}
exports.canBeCombined = canBeCombined;

function camelCase(name) {
    var splited = name.split('-')

    var collector = []
    splited.forEach(function(x) {
        collector.push(x.slice(0, 1).toUpperCase() + x.slice(1))
    })
    return collector.join('')
}

function len(arr) {
    return arr.length;
}

exports.len = len;
exports.containsHack = containsHack
exports.camelCase = camelCase