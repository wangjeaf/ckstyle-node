var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')

var OutlineCombiner = new Class(Combiner, function() {

    this.__init__ = function(self, name, attrs) {
        self.name = name
        self.attrs = attrs
        self.combined = ''
        self.collector = {}
        self.deleted = []
    }

    this.fill = function(self, prop, val) {
        self.collector[self.name + '-' + prop] = val
    }

    this._seperate = function(self, value) {
        value = value.replace(/\s*,\s*/g, ',')
        var splited = value.split(' ')
        var length = helper.len(splited)
        if (length == 1) {
            this.fill('width', value)
        } else if (length == 2) {
            this.fill('width', splited[0])
            this.fill('style', splited[1])
        } else if (length == 3) {
            this.fill('width', splited[0])
            this.fill('style', splited[1])
            this.fill('color', splited[2])
        }
    }

    this.collect = function(self) {
        var name = self.name
        var attrs = self.attrs
        attrs.forEach(function(prop) {
            if (helper.containsHack(prop[0], prop[1], prop[2]))
                return

            if (prop[1] == name) {
                self.hasFather = true
                self._seperate(prop[2])
            } else {
                if (!(prop[1] in self.deleted)) {
                    self.deleted.push(prop[1])
                }
                self.collector[prop[0]] = prop[2]
            }
        })
    }

    this.join = function(self) {
        var collector = [];
        var hasWidth, counter = 0;
        if (self.collector['outline-width']) {
            hasWidth = 1
            counter++
            collector.push(self.collector['outline-width'])
        }
        if (self.collector['outline-style']) {
            counter++
            collector.push(self.collector['outline-style'])
        }
        if (self.collector['outline-color']) {
            counter++
            collector.push(self.collector['outline-color'])
        }
        if (counter <= 1 && !hasWidth) {
            self.deleted = []
            self.hasFather = false
            self.combined = ''
            return
        }
        if (counter > 1 && !hasWidth) {
            collector.unshift('invert')
        }
        self.combined = collector.join(' ')
    }

    this.combine = function(self) {
        self.collect()
        self.join()
        return [self.combined, self.deleted, self.hasFather]
    }

})

module.exports = OutlineCombiner
