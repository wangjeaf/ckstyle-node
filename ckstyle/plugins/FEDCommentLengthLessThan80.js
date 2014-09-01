var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var StyleSheetChecker = base.StyleSheetChecker

module.exports = global.FEDCommentLengthLessThan80 = new Class(StyleSheetChecker, function () {
    this.__init__ = function (self) {
        self.id = 'comment-length';
        self.errorLevel = ERROR_LEVEL.LOG;
        self.errorMsg = 'comment for "${selector}" length should less than 80 per line';
    }

    this.check = function (self, styleSheet, config) {
        var comment = styleSheet.getRuleSets()[0].roughComment;
        if (comment.length == 0) {
            return true
        }

        var splittedComment = comment.split('\n');
        for (var i = 0, l = splittedComment.length; i < l; i++) {
            if (splittedComment[i].trim().length > 80) {
                return false
            }
        }
        return true
    }

    this.__doc__ = {
        "summary" : "注释不能超过80个字符",
        "desc" : "注释长度不能超过80个字符，40个汉字，如果超出，则应该要换行~"
    }
})