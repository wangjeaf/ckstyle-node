var parseCkStyleCmdArgs = require('./helper').parseCkStyleCmdArgs

exports.doTest = function() {
    _default()
}

function _default() {
    config = parseCkStyleCmdArgs(realpath('ckstyle_with_plugin.ini'), [], [], true)
    ok(config.pluginConfig, 'plugin config is not none')
    
    options = config.pluginConfig
    ok('plugin-a-config' in options, 'plugin config a')
    ok('plugin-b-config' in options, 'plugin config b')
    // config in lower case
    ok('pluginCConfig' in options, 'plugin c')

    equal(options['plugin-a-config'], '1', 'value of plugin config a')
    equal(options['plugin-b-config'], '2', 'value of plugin config b')
    equal(options['pluginCConfig'], '3', 'value of plugin config c')
}