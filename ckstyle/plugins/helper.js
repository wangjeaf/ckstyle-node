exports.heredoc = function(fn) {
    return fn.toString()
        .replace(/^[^\/]+\/\*!?/, "")
        .replace(/\*\/[^\/]+$/, "")
        .replace(/^[\s\xA0]+/, "")
        .replace(/[\s\xA0]+$/, "");
};

var fontFamilyNames = ("'arial black','book antiqua','comic sans ms','courier new','lucida console','lucida grande','lucida sans unicode','palatino linotype','times new roman','trebuchet ms',arial,charcoal,courier,cursive,gadget,geneva,geneva,helvetica,helvetica,impact,monaco,monospace,monospace,palatino,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,sans-serif,serif,serif,tahoma,times,verdana" + ",georgia").split(',')

exports.isFontFamilyName = function(font) {
    font = font.toLowerCase()
    var added = "," + font + ","
    return fontFamilyNames.indexOf(font) != -1 || fontFamilyNames.indexOf(added) != -1
}