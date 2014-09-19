var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')

/*
.transition {
    animation-name: myfirst;
    animation-duration: 5s;
    animation-timing-function: linear;
    animation-delay: 2s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-play-state: running;
    animation-fill-mode: none;
}

// ==> animation: myfirst 5s linear 2s infinite alternate;
*/
var AnimationCombiner = new Class(Combiner, function() {

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
            this.fill('name', value)
        } else if (length == 2) {
            this.fill('name', splited[0])
            this.fill('duration', splited[1])
        } else if (length == 3) {
            this.fill('name', splited[0])
            this.fill('duration', splited[1])
            this.fill('timing-function', splited[2])
        } else if (length == 4) {
            this.fill('name', splited[0])
            this.fill('duration', splited[1])
            this.fill('timing-function', splited[2])
            this.fill('delay', splited[3])
        } else if (length == 5) {
            this.fill('name', splited[0])
            this.fill('duration', splited[1])
            this.fill('timing-function', splited[2])
            this.fill('delay', splited[3])
            this.fill('iteration-count', splited[4])
        } else if (length == 6) {
            this.fill('name', splited[0])
            this.fill('duration', splited[1])
            this.fill('timing-function', splited[2])
            this.fill('delay', splited[3])
            this.fill('iteration-count', splited[4])
            this.fill('direction', splited[5])
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

    this.get = function(self, prop) {
        return self.collector[self.name + prop]
    }

    this.join = function(self) {
        var collector = [];
        var counter = 0;
        // console.log(self.collector)
        if (self.get('-name')) {
            counter++
            collector.push(self.get('-name'))
        }
        if (self.get('-duration')) {
            counter++
            collector.push(self.get('-duration'))
        }
        if (self.get('-timing-function')) {
            counter++
            collector.push(self.get('-timing-function'))
        }
        if (self.get('-delay')) {
            counter++
            collector.push(self.get('-delay'))
        }
        if (self.get('-iteration-count')) {
            counter++
            collector.push(self.get('-iteration-count'))
        }
        if (self.get('-direction')) {
            counter++
            collector.push(self.get('-direction'))
        }

        if (self.get('-play-state')) {
            counter++
            if (self.get('-play-state') != 'playing')
                collector.push(self.get('-play-state'))
        }

        if (self.get('-fill-mode')) {
            counter++
            if (self.get('-fill-mode') != 'none')
                collector.push(self.get('-fill-mode'))
        }

        if (counter < 3) {
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

module.exports = AnimationCombiner
