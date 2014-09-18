var base = require('../../base')
var Class = base.Class
var helper = require('./helper')

var combiners = {
    margin: require('./MarginCombiner'),
    padding: require('./PaddingCombiner'),
    background: require('./BackgroundCombiner'),
    outline: require('./OutlineCombiner'),
    border: require('./BorderCombiner'),
    'border-top': require('./BorderCombiner'),
    'border-left': require('./BorderCombiner'),
    'border-bottom': require('./BorderCombiner'),
    'border-right': require('./BorderCombiner'),
    font: require('./FontCombiner'),
    'border-radius': require('./BorderRadiusCombiner'),
    'list-style': require('./ListStyleCombiner')
}

function doCombine(name, props) {
    var pluginClass = combiners[name] || NullCombiner
    var instance = new pluginClass(name, props)
    return instance.combine()
}

var NullCombiner = new Class(function() {
    this.__init__ = function(self, name, props) {}
    this.combine = function(self) {
        return [null, [], false]
    }
})

exports.doCombine = doCombine


// if (!module.parent) {
//     console.log(doCombine('margin', [
//         ['margin', 'margin', '50px auto 0 auto']
//     ]))
//     console.log(doCombine('padding', [
//         ['padding', 'padding', '50px auto 50px auto']
//     ]))
// }