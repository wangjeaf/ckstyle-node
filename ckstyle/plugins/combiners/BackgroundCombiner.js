var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')

/*
.bg {
    background-color
    background-image
    background-repeat
    background-attachment
    background-position-x
    background-position-y
}
*/
var BackgroundCombiner = new Class(Combiner, function() {

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

    this._seperate2 = function(self, value) {
        value = value.replace(/\s*,\s*/g, ',')
        var splited = value.split(' ')
        var length = helper.len(splited)
        if (length == 2) {
            this.fill('position-x', splited[0])
            this.fill('position-y', splited[1])
        }
    }

    this._seperate = function(self, value) {
        value = value.replace(/\s*,\s*/g, ',')
        var splited = value.split(' ')
        var length = helper.len(splited)
        if (length == 1) {
            this.fill('image', value)
        } else if (length == 2) {
            this.fill('color', splited[0])
            this.fill('image', splited[1])
        } else if (length == 3) {
            this.fill('color', splited[0])
            this.fill('image', splited[1])
            this.fill('repeat', splited[2])
        } else if (length == 4) {
            this.fill('color', splited[0])
            this.fill('image', splited[1])
            this.fill('repeat', splited[2])
            this.fill('attachment', splited[3])
        } else if (length == 5) {
            this.fill('color', splited[0])
            this.fill('image', splited[1])
            this.fill('repeat', splited[2])
            this.fill('attachment', splited[3])
            this.fill('position-x', splited[4])
        } else if (length == 6) {
            this.fill('color', splited[0])
            this.fill('image', splited[1])
            this.fill('repeat', splited[2])
            this.fill('attachment', splited[3])
            this.fill('position-x', splited[4])
            this.fill('position-y', splited[5])
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
            } else if (prop[1] == 'background-position') {
                self.deleted.push(prop[1])
                self._seperate2(prop[2])
            } else {
                if (!(prop[1] in self.deleted)) {
                    self.deleted.push(prop[1])
                }
                if (prop[0].trim() == 'background-image' && prop[2].indexOf('url(') == -1) {
                    return
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
        if (self.get('-color')) {
            counter++
            collector.push(self.get('-color'))
        }
        if (self.get('-image')) {
            counter++
            collector.push(self.get('-image'))
        }
        if (self.get('-repeat')) {
            counter++
            collector.push(self.get('-repeat'))
        }
        if (self.get('-attachment')) {
            counter++
            if (self.get('-attachment') != 'scroll') 
                collector.push(self.get('-attachment'))
        }
        if (self.get('-position-x')) {
            counter++
            collector.push(self.get('-position-x'))
        }
        if (self.get('-position-y')) {
            counter++
            collector.push(self.get('-position-y'))
        }

        if (counter < 6) {
            self.combined = ''
            self.deleted = []
            self.hasFather = false
        } else {
            self.combined = collector.join(' ')
        }
    }

    this.combine = function(self) {
        self.collect()
        self.join()
        return [self.combined, self.deleted, self.hasFather]
    }

})

module.exports = BackgroundCombiner
