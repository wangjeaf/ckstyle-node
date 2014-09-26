CKStyle - 一脉相承的CSS工具集
============

[![Views in the last 24 hours](https://sourcegraph.com/api/repos/github.com/wangjeaf/ckstyle-node/counters/views-24h.png)](https://github.com/wangjeaf/ckstyle-node/)

CKStyle 是一个CSS的解析、检查、修复、压缩工具集。之前是 [Python版本](https://github.com/wangjeaf/csscheckstyle) 的，经过一段时间的改造升级，目前是JS版本。

支持Nodejs命令行工具、编辑器插件、官网在线编辑、CKService检查等多种功能。

官网在这里：[http://ckstyle.github.io](http://ckstyle.github.io)

## Install

`[sudo] npm install -g ckstyle`

## Usage

- `ckstyle check` 检查CSS的风格和正确性（检查精确度超过CSSLint）
- `ckstyle format` 简单格式化
- `ckstyle fix` 自动修复代码问题 + 格式化
- `ckstyle compress` 压缩CSS（目前已超过YUICompressor，局部超越clean-css）
- `ckstyle serve` 启动CKService支持服务，一键分析网站所有CSS的不足

试用，请上官网 [http://ckstyle.github.io/#startup](http://ckstyle.github.io/#startup)

## Features

- 更高的压缩率：压缩效果完整超越 `YUICompressor`，正极速追赶并局部超越 `clean-css`
- 更完整的工具体系：CSS开发，再也无需安装 `CSSLint`、`CSSTiny`、`CSSComb`、`YUICompressor`、`clean-css` 等一堆工具。
- 更强的扩展性：`功能即插件`，插件式开发，允许开发者自由扩展
- 更新颖的使用方式：`CKServcie一键分析`，再也不需要 `下载-->本地压缩-->Charles/Fiddler-->线上查看`
- 更多运行环境的支持：`Nodejs`、`命令行`、`浏览器环境` 都可使用
- 对开发者，更开放，更自由：全工具采用插件式设计，`开放的架构，开放的源码，开放的心态`

## License

CKStyle 遵循 [MIT LICENSE](https://github.com/wangjeaf/ckstyle-node/blob/master/LICENSE.md)