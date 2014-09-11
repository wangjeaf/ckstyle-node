var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')

var BackgroundCombiner = new Class(Combiner, function() {

    this.__init__ = function(self, name, attrs) {
        self.name = name
        self.attrs = attrs
        self.combined = ''
    }

    this.combine = function(self) {
        return [null, [], false]
    }

})

module.exports = BackgroundCombiner
