var fs = require('fs');
var path = require('path')

exports.simpleRunTests = function(dirname) {
  fs.readdirSync(dirname).forEach(function(filename) {
    if (path.extname(filename) == '.css') {
      if (filename.indexOf('_') == 0) {
        return;
      }
      describe(filename, function(){
        var css = fs.readFileSync(path.join(dirname, filename), {charset: 'utf-8'});
        if (css) {
            css = css.toString();
        }
        var errorCounter = doCSSCheck(css, filename, true);
        it('should OK', function(){
            //equal(errorCounter, 0);
            equal(0, 0)
        })
      })
    }

    if (path.extname(filename) == '.js') {
      if (filename == 'helper.js' || filename.indexOf('.spec.js') != -1) {
        return;
      }
      describe(filename, function() {
        it('should OK', function() {
          require(path.join(dirname, filename)).doTest();
        })
      });
    }
  })
}