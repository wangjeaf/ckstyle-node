var base = require('../../base')
var Class = base.Class
var helper = require('./helper')
var Combiner = require('./Combiner')


var PaddingCombiner = new Class(Combiner, function() {

    this.__init__ = function(self, name, attrs) {
        self.name = name
        self.attrs = attrs
        self.combined = ''
        self.collector = {}
        self.deleted = []
        self.hasFather = false
        self.subs = ['left', 'top', 'bottom', 'right']
        self.initSubs()
    }

    this.initSubs = function(self) {
        var name = self.name
        self.subs.forEach(function(sub) {
            self.collector[name + '-' + sub] = ''
        })
    }

    this._seperate = function(self, value) {
        value = helper.calc(value)
        var splited = value.split(' ')
        var top = right = bottom = left = ''
        var length = helper.len(splited)
        if (length == 1) {
            top = right = bottom = left = value
        } else if (length == 2) {
            top = bottom = splited[0].trim()
            left = right = splited[1].trim()
        } else if (length == 3) {
            top = splited[0].trim()
            left = right = splited[1].trim()
            bottom = splited[2].trim()
        } else if (length >= 4) {
            top = splited[0].trim()
            right = splited[1].trim()
            bottom = splited[2].trim()
            left = splited[3].trim()
        }
        var name = self.name
        self.collector[self.name + '-top'] = top
        self.collector[self.name + '-right'] = right
        self.collector[self.name + '-bottom'] = bottom
        self.collector[self.name + '-left'] = left
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
        var left = self.collector[self.name + '-left']
        var top = self.collector[self.name + '-top']
        var right = self.collector[self.name + '-right']
        var bottom = self.collector[self.name + '-bottom']

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
        self.combined = helper.uncalc(self.combined)
        return [self.combined, self.deleted, self.hasFather]
    }
})

module.exports = PaddingCombiner