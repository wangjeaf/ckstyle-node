var colors = require('colors')
var express = require('express')
var http = require('http')
var path = require('path')

var router = require('./helper/router')

var app = express();
var server = http.createServer(app);

function startServer(port) {
    port = port || 3000;
    app.set('port', port);
    app.set('views', path.join(__dirname + '../views'))
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // routes
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '../')));

    // add error handler
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    router.route(app);

    http.createServer(app).listen(port, function(){
        console.log('[ckstyle log] Express server listening on port '.green + (''+port).red + (' in ' + app.get('env') + ' mode.').green);
    });
}

exports.meta = {
    name: 'serve',
    options: [{
        flags: "-p, --port",
        description: '端口号',
        defaultValue: false
    }],
    description: '启动ckservice服务器，用于接收ckservice的请求（先开发，未来拆出去）'
}

exports.handle = function() {
    startServer(arguments[0]);
}
