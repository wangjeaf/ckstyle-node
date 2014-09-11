var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')

var FontCombiner = new Class(Combiner, function() {

    this.__init__ = function(self, name, attrs) {
        self.name = name
        self.attrs = attrs
        self.combined = ''
        self.collector = {}
        self.deleted = []
    }

    this.join = function(self) {
        //console.log(self.collector)
        // border: 1px solid red
        // border-width: 2px
        // border-top-width

    }

    this.combine = function(self) {
        // self.collect()
        // self.join()
        return [null, [], false]
        //return [self.combined, self.deleted, self.hasFather]
    }

})

module.exports = FontCombiner
