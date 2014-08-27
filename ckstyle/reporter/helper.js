function fill(obj) {
    function fillRuleSet(obj) {
        var errorMsg = obj["errorMsg"]
        if (errorMsg.indexOf('${selector}') == -1)
            errorMsg = errorMsg + ' (from "' + obj["selector"] + '")'
        else
            errorMsg = errorMsg.replace('${selector}', obj["selector"])
        return errorMsg
    }

    function fillStyleSheet(obj) {
        var errorMsg = obj["errorMsg"]
        if (errorMsg.indexOf('${file}') == -1)
            errorMsg = errorMsg + ' (from "' + obj["file"] + '")'
        else
            errorMsg = errorMsg.replace('${file}', obj["file"])
        return errorMsg
    }

    function fillRule(obj) {
        var errorMsg = obj["errorMsg"]
        if (errorMsg.indexOf('${selector}') == -1)
            errorMsg = errorMsg + ' (from "' + obj["selector"] + '")'
        else
            errorMsg = errorMsg.replace('${selector}', obj["selector"])
        errorMsg = errorMsg.replace('${name}', obj["name"])
        errorMsg = errorMsg.replace('${value}', obj["value"])
        return errorMsg
    }

    var level = obj["level"]
    if (level == 'rule')
        return fillRule(obj)
    else if (level == 'ruleset')
        return fillRuleSet(obj)
    else if (level == 'stylesheet')
        return fillStyleSheet(obj)
    return obj["errorMsg"]
}

exports.fill = fill;