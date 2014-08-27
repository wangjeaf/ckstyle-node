var BinaryRule = require('../../ckstyle/browsers/BinaryRule');
for(var prop in BinaryRule) {
    global[prop] = BinaryRule[prop]
}

var Hacks = require('../../ckstyle/browsers/Hacks');
for(var prop in Hacks) {
    global[prop] = Hacks[prop]
}
