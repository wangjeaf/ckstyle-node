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
                self.collector[prop[0]] = prop[2].trim().replace(/\s\s/g, ' ');
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

/*

.foo4 {\
    border-top-left-radius: 2em 0.5em;\
    border-top-right-radius: 1em 3em;\
    border-bottom-right-radius: 4em 0.5em;\
    border-bottom-left-radius: 1em 3em;\
}
==> .foo4{border-radius:2em 1em 4em/.5em 3em}
*/
        var top1, top2, right1, right2, bottom1, bottom2, left1, left2;

        var tmp = top.split(' ');
        top1 = tmp[0]
        top2 = tmp[1] || tmp[0]

        var tmp = right.split(' ');
        right1 = tmp[0]
        right2 = tmp[1] || tmp[0]

        var tmp = bottom.split(' ');
        bottom1 = tmp[0]
        bottom2 = tmp[1] || tmp[0]

        var tmp = left.split(' ');
        left1 = tmp[0]
        left2 = tmp[1] || tmp[0]

        var part1 = '', part2 = ''
        if (left1 == right1 && right1 == bottom1 && bottom1 == top1) {
            part1 = left1
        } else if (left1 == right1 && bottom1 == top1) {
            part1 = top1 + ' ' + left1
        } else if (top1 != bottom1 && left1 == right1) {
            part1 = top1 + ' ' + right1 + ' ' + bottom1
        } else {
            part1 = top1 + ' ' + right1 + ' ' + bottom1 + ' ' + left1
        }

        if (left2 == right2 && right2 == bottom2 && bottom2 == top2) {
            part2 = left2
        } else if (left2 == right2 && bottom2 == top2) {
            part2 = top2 + ' ' + left2
        } else if (top2 != bottom2 && left2 == right2) {
            part2 = top2 + ' ' + right2 + ' ' + bottom2
        } else {
            part2 = top2 + ' ' + right2 + ' ' + bottom2 + ' ' + left2
        }

        self.combined = part1.trim()
        part2 = part2.trim()
        if (part2 != part1.trim()) {
            self.combined += '/' + part2
        }
    }

    this.combine = function(self) {
        self.collect()
        self.join()
        return [self.combined, self.deleted, self.hasFather]
    }
})

module.exports = BorderRadiusCombiner