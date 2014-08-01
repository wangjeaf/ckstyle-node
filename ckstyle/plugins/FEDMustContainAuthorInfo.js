var base = require('../base')
var ERROR_LEVEL = base.ERROR_LEVEL
var Class = base.Class
var StyleSheetChecker = base.StyleSheetChecker

module.exports = global.FEDMustContainAuthorInfo = new Class(StyleSheetChecker, function() {
    this.__init__ = function(self) {
        self.id = 'add-author'
        self.errorMsg_author = 'should add @author in the head of "${file}"'
        self.errorMsg_empty = 'empty css file "${file}"'
        self.errorMsg = ''
        self.errorLevel = ERROR_LEVEL.ERROR
    }

    this.check = function(self, styleSheet, config) {
        ruleSets = styleSheet.getRuleSets()
        if (ruleSets.length == 0) {
            self.errorMsg = self.errorMsg_empty
            return false
        }

        first = ruleSets[0]

        if (styleSheet.getFile() != '' 
            && first.comment.indexOf('@author') == -1 
            && first.comment.indexOf('@renren-inc.com') == -1) {
            self.errorMsg = self.errorMsg_author
            return false
        }
        return true 
    }

    this.__doc__ = {
        "summary":"需要在文件中添加作者信息",
        "desc":"需要在文件中添加作者的信息，本工具认可的作者信息是在文件顶部的注释中添加 <code>@author:xxx</code>"
    }
})