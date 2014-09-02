function containsHack(name, strippedName, value) {
    return name != strippedName || value.indexOf('\9') != -1
}

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