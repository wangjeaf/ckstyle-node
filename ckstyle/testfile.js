var styler = require('./ckstyler');
var fs = require('fs'),path = require('path');

var CssChecker = styler.CssChecker;

	var pathHandle = function (parser) {
		var base = process.cwd();
		var realPath = path.join(base, path.normalize(parser.replace(/\.\./g, "")));
		
		
		fs.stat(realPath, function (err, stats) {
			if (err) {
				console.error('[TOOL] wrong ErrorLevel for ' + err);
			} else {
				if (stats.isDirectory()) {
					//文件目录内所有文件遍历
				} else {
				
					var ext = path.extname(realPath);
					ext = ext ? ext.slice(1) : 'unknown';

					if (ext.match(/css/)) {
						console.log(realPath)
						fs.readFile(realPath,"utf-8",function(err,d){

							var checker = new CssChecker(d);
							checker.prepare() // load plugins, do css parser;

							checker.doCheck();
							var errors = checker.getErrors()
							//console.log(errors);

							var fixed = checker.doFix();
							console.log(fixed);

							var compressed = checker.doCompress();
							//console.log(compressed);
							
							
						})
					}

				}
			}
		});
	};


	pathHandle('1.css')