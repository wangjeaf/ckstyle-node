// url: 请求绝对路径
// callback: callback(err, fileContent) 

var request = require('request')

exports.requestCSSFile = function(url, callback) {
    request.get(url, function(err, res, body) {
        if (err) {
          return callback(err);
        }

        //非200的请求认为是失败的
        if (res.statusCode !== 200) {
          return ('download ' + url + ' has server error code:' + res.statusCode + ' body: ' + body)
        }

        callback(null, body)
    })
}
