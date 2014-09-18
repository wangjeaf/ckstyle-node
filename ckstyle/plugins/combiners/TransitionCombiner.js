var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')

/*
// ==> transiton: padding .36s ease -1s;

.transition {
  transition-property: padding;
  transition-duration: .36s;
  transition-timing-function: ease;
  transition-delay: -1s;
}
*/
var TransitionCombiner = new Class(Combiner, function() {

    this.__init__ = function(self, name, attrs) {
        self.name = name.trim()
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
            this.fill('duration', value)
        } else if (length == 2) {
            this.fill('property', splited[0])
            this.fill('duration', splited[1])
        } else if (length == 3) {
            this.fill('property', splited[0])
            this.fill('duration', splited[1])
            this.fill('timing-function', splited[2])
        } else if (length == 4) {
            this.fill('property', splited[0])
            this.fill('duration', splited[1])
            this.fill('timing-function', splited[2])
            this.fill('delay', splited[3])
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
                self.collector[prop[0].trim()] = prop[2]
            }
        })
    }

    this.join = function(self) {
        var collector = [];
        var counter = 0;
        // console.log(self.collector)
        if (self.collector[self.name + '-property']) {
            counter++
            collector.push(self.collector[self.name + '-property'])
        }
        if (self.collector[self.name + '-duration']) {
            counter++
            collector.push(self.collector[self.name + '-duration'])
        }
        if (self.collector[self.name + '-timing-function']) {
            counter++
            collector.push(self.collector[self.name + '-timing-function'])
        }
        if (self.collector[self.name + '-delay']) {
            counter++
            collector.push(self.collector[self.name + '-delay'])
        }
        if (counter != 2 && counter != 4) {
            self.combined = ''
            self.deleted = []
            self.hasFather = false
        }
        self.combined = collector.join(' ')
    }

    this.combine = function(self) {
        self.collect()
        self.join()
        return [self.combined, self.deleted, self.hasFather]
    }

})

module.exports = TransitionCombiner
