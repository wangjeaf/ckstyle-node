var colors = require('colors')
var express = require('express')
var http = require('http')
var path = require('path')
var o = require('./helper/options')
var router = require('./helper/router')
var logger = require('../ckstyle/logger/index')

exports.meta = {
    name: 'serve',
    options: [
        o.port
    ],
    description: '启动ckservice服务器，用于接收ckservice的请求'
}

exports.handle = function() {
    startServer(arguments[0].port);
}

function startServer(port) {
    var app = express();
    var server = http.createServer(app);

    if (port === true || port === false) {
        port = null;
    }
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
        logger.ok('Express server listening on port ' + port + ' in ' + app.get('env') + ' mode.');
    });
}
