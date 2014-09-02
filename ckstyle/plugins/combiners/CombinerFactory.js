var base = require('../../base')
var Class = base.Class
var helper = require('./helper')

function doCombine(name, props) {
    var pluginName = helper.camelCase(name) + 'Combiner'
    var pluginClass = NullCombiner
    try {
        // attempt to load combiner
        pluginClass = require('./' + pluginName)
    } catch(e) {}
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


if (!module.parent) {
    console.log(doCombine('margin', [
        ['margin', 'margin', '50px auto 0 auto']
    ]))
    console.log(doCombine('padding', [
        ['padding', 'padding', '50px auto 50px auto']
    ]))
}