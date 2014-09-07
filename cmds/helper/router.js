var requester = require('./CssFileRequester')

exports.route = function(app) {
    app.get('/cssfile/*', function(req, res) {
        var filepath = req.params[0];
        var cb = req.query.callback;
        if (!cb) {
            return res.json({
                code: 500,
                msg: 'no callback'
            });
        }
        var index = req.query.index;
        if (!index) {
           return res.json({
                code: 500,
                msg: 'no index'
            });
        }

        res.writeHead(200, {'Content-Type': 'text/javascript'});

        requester.requestCSSFile(filepath, function(err, content) {
            res.end(cb + '(' + JSON.stringify({
                code: content,
                url: filepath,
                index: index
            })+ ')');
        })
    });

    app.get('/help|/h', function(req, res) {
        res.json({
            '-----': '本服务器的主要功能介绍',
            '功能列表': [
                '提供远程CSS文件的下载功能，用于解决CSS跨域问题',
                '架设服务器下的public资源的访问路径，未来用于官网建设'
            ],
            '路由匹配': {
                '/cssfile/[url]': '下载css文件',
                '/help': '本帮助',
                '/h': '本帮助'
            }
        })
    });
}