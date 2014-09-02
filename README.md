ckstyle-node
============

[![Views in the last 24 hours](https://sourcegraph.com/api/repos/github.com/wangjeaf/ckstyle-node/counters/views-24h.png)](https://github.com/wangjeaf/ckstyle-node/)

nodejs version of ckstyle

### 命令行开发

准备

- `npm install` 安装依赖包
- `(sudo) npm install -g mocha` 安装mocha命令行测试工具
- `(sudo) npm install -g grunt-cli` 安装grunt命令行工具
- `(sudo) npm link` 连接ckstyle命令行工具

然后

- `ckstyle demo` 运行demo命令
- `ckstyle demo2` 运行demo命令2

#### 目标

一期先达到如下几个目标：

1. `(sudo) npm install -g ckstyle` 一键安装
2. `ckstyle check xxxxxx` 检查
3. `ckstyle fix xxxxxx` 修复
4. `ckstyle compress xxxxxx` 压缩

具体每个命令的参数，请参见 [https://github.com/wangjeaf/CSSCheckStyle#usag(https://github.com/wangjeaf/CSSCheckStyle#usage)