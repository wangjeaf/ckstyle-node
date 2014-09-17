CKStyle - 一个CSS工具集
============

[![Views in the last 24 hours](https://sourcegraph.com/api/repos/github.com/wangjeaf/ckstyle-node/counters/views-24h.png)](https://github.com/wangjeaf/ckstyle-node/)

CKStyle 是一个CSS的解析、检查、修复、压缩工具集。之前是 [Python版本](https://github.com/wangjeaf/csscheckstyle) 的，经过一段时间的改造升级，目前是JS版本。

支持Nodejs命令行工具、编辑器插件、官网在线编辑、CKService检查等多种功能。

官网在这里：[http://ckstyle.github.io](http://ckstyle.github.io)

## Install

`[sudo] npm install -g ckstyle`

## Usage

```css
/* 示例 */
.test {-webkit-transition: 1s; -moz-transition: 1s; _width:10px; *color:#ffffff; padding:0; 
padding-top: 20px }
```

`ckstyle compress -p --browsers="ie6,ie7,ie,chrome,firefox,safari,opera" ./test.css` `===>`
```css
firefox : .test{padding:20px 0 0;-moz-transition:1s}
chrome  : .test{padding:20px 0 0;-webkit-transition:1s}
ie7     : .test{padding:20px 0 0;*color:#FFF}
ie6     : .test{_width:10px;padding:20px 0 0;*color:#FFF}
opera   : .test{padding:20px 0 0}
safari  : .test{padding:20px 0 0;-webkit-transition:1s}
ie      : .test{_width:10px;padding:20px 0 0;*color:#FFF}
```

更多使用，请上官网 [http://ckstyle.github.io/#install](http://ckstyle.github.io/#install)

## Service

一次点击，分析任何网站的CSS。

以淘宝网为例：

![ckservice-taobao](http://ckstyle.github.io/img/ckservice-taobao.jpg)

更多使用，请上官网 [http://ckstyle.github.io/#service](http://ckstyle.github.io/#service)

## License

CKStyle 遵循 [MIT LICENSE](https://github.com/wangjeaf/ckstyle-node/blob/master/LICENSE.md)