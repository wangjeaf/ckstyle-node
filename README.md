ckstyle-node
============

[![Views in the last 24 hours](https://sourcegraph.com/api/repos/github.com/wangjeaf/ckstyle-node/counters/views-24h.png)](https://github.com/wangjeaf/ckstyle-node/)

nodejs version of ckstyle

### 开发

准备

- `npm install` 安装依赖包
- `(sudo) npm install -g mocha` 安装mocha命令行测试工具
- `(sudo) npm install -g grunt-cli` 安装grunt命令行工具
- `(sudo) npm link` 连接ckstyle命令行工具

然后

- `ckstyle demo` 运行demo命令
- `ckstyle demo2` 运行demo命令2

### CKService

bookmarklet代码：

```
javascript:(function(win,doc)%7Bif(win.location.href%3D%3D%27%27)%7Breturn%3B%7D var div%3Ddoc.createElement(%27div%27)%3Bdiv.className %3D %27ckservice-loading%27%3Bdiv.style.cssText %3D %27position:fixed%3Bleft:1px%3Btop:1px%3Bborder:1px solid #DDD%3Bbox-shadow:1px 1px 3px rgba(0,0,0,.3)%3Bpadding:5px 20px%3Bfont-size:16px%3B%27%3Bdiv.innerHTML %3D %27Loading CKService...%27%3Bdoc.body.appendChild(div)%3Bvar s %3D doc.createElement(%27script%27)%3Bs.async%3Dtrue%3Bs.defer%3Dtrue%3Bs.src%3D%27http://127.0.0.1:3000/dist/ckservice.min.js%27%3Bdoc.body.appendChild(s)%3B%7D)(this, document)%3B
```