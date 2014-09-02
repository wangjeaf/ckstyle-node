var fs = require('fs');
var CSSParser = require('./parser/index').CSSParser;

var base = require('./base');
var ERROR_LEVEL = base.ERROR_LEVEL;
var Class = base.Class;
var ALL = require('./browsers/index').BinaryRule.ALL;
var isFunction = base.isFunction
var isObject = base.isObject
var findInArray = base.findInArray

var CssChecker = new Class(function() {
    this.__init__ = function(self, parser, config) {
        if (typeof parser == 'string') {
            parser = new CSSParser(parser, config && config.fileName ? config.fileName : 'TMP');
        }
        self.parser = parser
        self.config = config || {}

        // 错误记录，log是2级，warn是1级，error是0级
        self.logMsgs = []
        self.warningMsgs = []
        self.errorMsgs = []

        // 额外的错误记录，比如工具内部的一些错误等
        self.extraMsgs = []

        // 注册的不同类型的检查器（都来自plugins目录）
        self.ruleSetCheckers = []
        self.ruleCheckers = []
        self.styleSheetCheckers = []

        self.extraCheckers = []

        // 如果有解析过程的错误，则先把那些错误记录下来
        self.handleParseErrors()
    };

    this.prepare = function(self, pluginDir, config) {
        this.loadPlugins(pluginDir);
        this.doParse(config);
    }

    this.resetStyleSheet = function(self) {
        self.parser.styleSheet.rebase()
    }

    this.doParse = function(self) {
        this.parser.doParse(this.config);
    }

    this.getStyleSheet = function(self) {
        // 获取styleSheet引用
        return self.parser.styleSheet
    }

    this.handleParseErrors = function(self) {
        self.parser.getParseErrors().forEach(function(msg) {
            self.remember(msg[0], msg[1])
        })
    }

    this.hasError = function(self) {
        // 判断是否有error
        return self.logMsgs.length != 0 || self.warningMsgs.length != 0 || self.errorMsgs.length != 0
    }

    this.getErrors = this.errors = function(self) {
        // 把错误信息导出
        return [self.logMsgs, self.warningMsgs, self.errorMsgs]
    }

    this.loadPlugins = function(self, pluginDir) {
        if (typeof define == "function" && (define.amd || define.cmd)) {
            var plugins = require('./plugins/index');
            for(var prop in plugins) {
                self.registerPluginClass(plugins[prop])
            }
            return;
        }
        pluginDir = pluginDir || (fs.realpathSync(__dirname) + '/plugins');
        self._doLoadPlugins(pluginDir)
    }

    this._doLoadPlugins = function(self, pluginDir) {
        
        // 从plugins目录动态载入检查类
        fs.readdirSync(pluginDir).forEach(function(filename) {
            if (filename.slice(-3) != '.js' || filename.slice(-1) == '_') {
                return
            }
            if (filename == 'index.js' || filename == 'helper.js') {
                return
            }
            var fullpath = './plugins/' + filename, plugin;
            try {
                plugin = require(fullpath)
            } catch (e) {
                console.log(e);
                plugin = null;
            }
            if (plugin) {
                self.registerPluginClass(plugin)
            }
        })
    }

    this.registerPluginClass = function(self, pluginClass) {
        var include = self.config.include || 'all'
        var exclude = self.config.exclude || []
        var safeMode = self.config.safeMode || false
        var safeModeExcludes = 'combine-same-rulesets'
        var instance = null;

        if (isFunction(pluginClass)) {
            instance = new pluginClass();
        } else if (isObject(pluginClass)) {
            // 构造plugin的类
            instance = pluginClass
        }
        

        // 如果是always，则说明不论是否选择都需要的规则
        if (!instance.always) {
            if (include != 'all' && include.indexOf(instance.id) == -1) {
                return
            } else if (exclude != 'none' && exclude.indexOf(instance.id) != -1) {
                return
            } else if (safeMode && safeModeExcludes.indexOf(instance.id) != -1) {
                return
            }
        }
        self.registerChecker(instance)
    }

    this.registerChecker = function(self, checker) {
        // 根据检查器类型的不同，分别注册到不同的检查器列表中
        if (checker.parent && checker.parent.type == 'rule' || checker.type == 'rule') {
            self.registerRuleChecker(checker)
        } else if (checker.parent && checker.parent.type == 'ruleset' || checker.type == 'ruleset') {
            self.registerRuleSetChecker(checker)
        } else if (checker.parent && checker.parent.type == 'stylesheet' || checker.type == 'stylesheet') {
            self.registerStyleSheetChecker(checker)
        } else {
            self.registerExtraChecker(checker)
        }
    }

    this.registerStyleSheetChecker = function(self, checker) {
        self.styleSheetCheckers.push(checker)
    }

    this.registerRuleSetChecker = function(self, checker) {
        self.ruleSetCheckers.push(checker)
    }

    this.registerRuleChecker = function(self, checker) {
        self.ruleCheckers.push(checker)
    }

    this.registerExtraChecker = function(self, checker) {
        self.extraCheckers.push(checker)
    }

    this.remember = function(self, errorLevel, errorMsg) {
        // 记录代码中的问题
        if (errorLevel == ERROR_LEVEL.LOG) {
            if (!self.config.errorLevel || self.config.errorLevel > 1) {
                self.logMsgs.push(errorMsg)
            }
        } else if (errorLevel == ERROR_LEVEL.WARNING) {
            if (!self.config.errorLevel || self.config.errorLevel > 0) {
                self.warningMsgs.push(errorMsg)
            }
        } else if (errorLevel == ERROR_LEVEL.ERROR) {
            self.errorMsgs.push(errorMsg)
        } else {
            console.error('[TOOL] wrong ErrorLevel for ' + errorMsg)
        }
    }

    this.logStyleSheetMessage = function(self, checker, styleSheet, errors) {
        // 记录StyleSheet的问题
        errorLevel = checker.level || checker.errorLevel;
        if (errors == null) {
            errors = [checker.msg || checker.errorMsg]
        }
        errors.forEach(function(errorMsg) {
            obj = {}
            if (!errorMsg)
                console.error('[TOOL] no errorMsg in your plugin, please check it')

            if (errorMsg.indexOf('${file}') == -1) {
                errorMsg = errorMsg + ' (from "' + styleSheet.getFile() + '")'
            // } else {
            //    errorMsg = errorMsg.replace('${file}', styleSheet.getFile())
            }

            obj["errorMsg"] = errorMsg
            obj["file"] = styleSheet.getFile()
            obj["level"] = 'stylesheet'
            self.remember(errorLevel, obj);
        })
    }

    this.logRuleMessage = function(self, checker, rule, errors) {
        // 记录一条key/value的问题
        errorLevel = checker.level || checker.errorLevel;
        if (!errors)
            errors = [checker.msg || checker.errorMsg]
        errors.forEach(function(errorMsg) {
            obj = {}
            if (!errorMsg) {
                console.error('[TOOL] no errorMsg in your plugin, please check it')
                return;
            }
            if (errorMsg.indexOf('${selector}') == -1) {
                errorMsg = errorMsg + ' (from "' + rule.selector + '")'
            //} else {
            //    errorMsg = errorMsg.replace('${selector}', rule.selector)
            }
            //errorMsg = errorMsg.replace('${name}', rule.roughName.trim())
            //errorMsg = errorMsg.replace('${value}', rule.value.trim())
            obj["errorMsg"] = errorMsg
            obj["selector"] = rule.selector
            obj["name"] = rule.roughName.trim()
            obj["value"] = rule.value.trim()
            obj["level"] = 'rule'
            self.remember(errorLevel, obj);
        });
    }

    this.logRuleSetMessage = function(self, checker, ruleSet, errors) {
        // 记录一个"规则集"中的问题
        errorLevel = checker.level || checker.errorLevel;
        if (!errors) {
            errors = [checker.msg || checker.errorMsg]
        }
        errors.forEach(function(errorMsg) {
            obj = {}
            if (errorMsg.indexOf('${selector}') == -1) {
                errorMsg = errorMsg + ' (from "' + ruleSet.selector + '")'
            //} else {
            //    errorMsg = errorMsg.replace('${selector}', ruleSet.selector)
            }
            obj["errorMsg"] = errorMsg
            obj["selector"] = ruleSet.selector
            obj["level"] = 'ruleset'
            self.remember(errorLevel, obj);
        });
    }

    this.doCompress = function(self, browser) {
        browser = browser || ALL;
        self.config._curBrowser = browser
        self.doFix(browser)
        return self.getStyleSheet().compress(browser).trim()
    }

    this.doFix = function(self, browser) {
        browser = browser || ALL;
        self.resetStyleSheet()
        // 忽略的规则集（目前只忽略单元测试的selector）
        ignoreRuleSets = self.config.ignoreRuleSets

        // fix规则集
        function fixRuleSet(ruleSet) {
            self.ruleSetCheckers.forEach(function(checker) {
                if (!checker.fix) {
                    return;
                }
                if (ruleSet.fixedSelector == '') {
                    ruleSet.fixedSelector = ruleSet.selector
                    ruleSet.fixedComment = ruleSet.comment
                }
                checker.fix(ruleSet, self.config)
            });
        }

        // fix规则
        function fixRules(ruleSet) {
            self.ruleCheckers.forEach(function(checker) {
                ruleSet.getRules().forEach(function(rule) {
                    if (!checker.fix) {
                        return;
                    }

                    // 确保fixedName/fixedValue一定有值
                    // fix中一定要针对fixedName/fixedValue来判断，确保其他plugin的fix不会被覆盖
                    if (rule.fixedValue == '') {
                        rule.fixedValue = rule.value
                        rule.fixedName = rule.strippedName
                    }
                    // print checker.id, checker, rule.fixedValue
                    checker.fix(rule, self.config)
                });
            });
        }

        function fixExtraRules(ruleSet) {
            self.extraCheckers.forEach(function(checker) {
                if (!checker.fix) {
                    return;
                }
                if (ruleSet.fixedSelector == '') {
                    ruleSet.fixedSelector = ruleSet.selector
                    ruleSet.fixedStatement = ruleSet.statement
                }
                checker.fix(ruleSet, self.config)
            });
        }

        styleSheet = self.parser.styleSheet

        styleSheet.getRuleSets().forEach(function(ruleSet) {
            if (ruleSet.extra) {
                fixExtraRules(ruleSet)
                return
            }
            // 判断此规则是否忽略
            if (findInArray(ignoreRuleSets, ruleSet.selector)) {
                return
            }
            // 先fix rule
            fixRules(ruleSet)
            // 再fix ruleSet
            fixRuleSet(ruleSet)
        });

        // 最后fix styleSheet
        self.styleSheetCheckers.forEach(function(checker) {
            if (checker.fix) {
                checker.fix(styleSheet, self.config)
            }
        });
        return self.getStyleSheet().fixed(self.config)
    }

    this.doCheck = function(self) {
        // 忽略的规则集（目前只忽略单元测试的selector）
        ignoreRuleSets = self.config.ignoreRuleSets

        function isBoolean(value) {
            return value === true || value === false;
        }

        function isList(value) {
            return Array.isArray(value)
        }

        // 检查规则集
        function checkRuleSet(ruleSet) {
            self.ruleSetCheckers.forEach(function(checker) {
                if (!checker.check) {
                    return;
                }
                result = checker.check(ruleSet, self.config)
                if (isBoolean(result)) {
                    if (!result) {
                        self.logRuleSetMessage(checker, ruleSet)
                    }
                } else if (isList(result) && len(result) != 0) {
                    self.logRuleSetMessage(checker, ruleSet, result)
                } else {
                    console.error('check should be boolean/list, ' + checker.id + ' is not.')
                }
            });
        }

        // 检查规则
        function checkRule(ruleSet) {
            self.ruleCheckers.forEach(function(checker) {
                ruleSet.getRules().forEach(function(rule) {
                    if (!checker.check) {
                        return;
                    }
                    result = checker.check(rule, self.config)
                    if (isBoolean(result)) {
                        if (!result) {
                            self.logRuleMessage(checker, rule)
                        }
                    } else if (isList(result) && len(result) != 0) {
                        self.logRuleMessage(checker, rule, result)
                    } else {
                        console.error('check should be boolean/list, ' + checker.id + ' is not.')
                    }
                });
            });
        }

        // 检查规则
        function checkExtraRule(ruleSet) {
            self.extraCheckers.forEach(function(checker) {
                if (!checker.check) {
                    return;
                }
                result = checker.check(ruleSet, self.config)
                if (isBoolean(result)) {
                    if (!result) {
                        self.logRuleSetMessage(checker, ruleSet)
                    }
                } else if (isList(result) && len(result) != 0) {
                    self.logRuleSetMessage(checker, ruleSet, result)
                } else {
                    console.error('check should be boolean/list, ' + checker.id + ' is not.')
                }
            });
        }

        // 检查样式表
        styleSheet = self.parser.styleSheet
        self.styleSheetCheckers.forEach(function(checker) {
            if (!checker.check) {
                return;
            }
            result = checker.check(styleSheet, self.config)
            if (isBoolean(result)) {
                if (!result) {
                    self.logStyleSheetMessage(checker, styleSheet)
                }
            } else if (isList(result) && result.length != 0) {
                self.logStyleSheetMessage(checker, styleSheet, result)
            } else {
                console.error('check should be boolean/list, ' + checker.id + ' is not.')
            }
        });

        styleSheet.getRuleSets().forEach(function(ruleSet) {
            if (ruleSet.extra) {
                checkExtraRule(ruleSet)
                return;
            }
            // 判断此规则是否忽略
            if (findInArray(ignoreRuleSets, ruleSet.selector)) {
                return;
            }
            checkRuleSet(ruleSet)
            checkRule(ruleSet)
        })
    }
});

exports.CssChecker = CssChecker;