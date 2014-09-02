var commander = require('commander')
var join = require('path').join
var path = require('path')
var rootDir = __dirname
var fs = require('fs')

var cmdPath = function(file) {
  return join(rootDir, 'cmds', file)
}

fs.readdirSync(path.join(rootDir, 'cmds')).forEach(function(filename) {
  if (path.extname(filename) != '.js') {
    return
  }
  var cmdMeta = require(cmdPath(filename));
  var meta = cmdMeta.meta;
  var handle = cmdMeta.handle;
  if (!meta || !handle) {
    console.error(filename + ' 文件，不符合lego2命令文件规范')
    console.error('每一个命令必须包含 meta(命令描述) 和 handle(命令处理函数) 两个部分')
    return;
  }
  var cmd = commander.command(meta.name);
  cmd.description(meta.description)
  if (meta.options) {
    meta.options.forEach(function(op) {
      cmd.option(op.flags, op.description, op.defaultValue)
    })
  }
  cmd.action(handle)
});

exports.start = function() {
  commander.parse(process.argv)

  if (commander.rawArgs.length == 2) {
    commander.help()
  }
}