var times = {}

exports.start = function(id) {
    times[id] = times[id] || {}
    times[id].total = times[id].total || 0
    times[id].timer = + new Date
}

exports.end = function(id) {
    times[id] = times[id] || {}
    if (times[id].timer) {
        times[id].total += + new Date - times[id].timer;
        times[id].timer = 0;
    }
}

exports.report = function() {
    for(var prop in times) {
        var total = times[prop].total;
        total > 100 && console.log('[TIMER] ' + prop + ', ' + total)
        delete times[prop]
    }
}