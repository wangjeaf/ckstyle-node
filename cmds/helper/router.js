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

    app.get('/help', function(req, res) {
        res.json({
            '功能1': '本服务器目前提供远程CSS文件的下载功能，用于解决CSS跨域问题',
            '功能2': '以根目录启动服务器，访问public下的测试页面'
        })
    });
}