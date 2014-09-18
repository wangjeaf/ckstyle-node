var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')


var BorderRadiusCombiner = new Class(Combiner, function() {

    this.__init__ = function(self, name, attrs) {
        self.name = name
        self.attrs = attrs
        self.combined = ''
        self.collector = {}
        self.deleted = []
        self.hasFather = false
        self.initSubs()
    }

    this.initSubs = function(self) {
        var name = self.name
        self.collector['border-top-left-radius'] = ''
        self.collector['border-top-right-radius'] = ''
        self.collector['border-bottom-left-radius'] = ''
        self.collector['border-bottom-right-radius'] = ''
    }

    this._seperate = function(self, value) {
        var splited = value.split(' ')
        var a = b = c = d = ''
        var length = helper.len(splited)
        if (length == 1) {
            a = b = c = d = value
        } else if (length == 2) {
            a = c = splited[0].trim()
            d = b = splited[1].trim()
        } else if (length == 3) {
            a = splited[0].trim()
            d = b = splited[1].trim()
            c = splited[2].trim()
        } else if (length >= 4) {
            a = splited[0].trim()
            b = splited[1].trim()
            c = splited[2].trim()
            d = splited[3].trim()
        }
        var name = self.name
        self.collector['border-top-left-radius'] = a
        self.collector['border-top-right-radius'] = b
        self.collector['border-bottom-right-radius'] = c
        self.collector['border-bottom-left-radius'] = d
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
        var top = self.collector['border-top-left-radius']
        var right = self.collector['border-top-right-radius']
        var bottom = self.collector['border-bottom-right-radius']
        var left = self.collector['border-bottom-left-radius']

        if (left == '' || top == '' || right == '' || bottom == '') {
            self.combined = null
            self.deleted = []
            return
        }

        if (left == right && right == bottom && bottom == top) {
            self.combined = left
        } else if (left == right && bottom == top) {
            self.combined = top + ' ' + left
        } else if (top != bottom && left == right) {
            self.combined = top + ' ' + right + ' ' + bottom
        } else {
            self.combined = top + ' ' + right + ' ' + bottom + ' ' + left
        }
    }

    this.combine = function(self) {
        self.collect()
        self.join()
        return [self.combined, self.deleted, self.hasFather]
    }
})

module.exports = BorderRadiusCombiner