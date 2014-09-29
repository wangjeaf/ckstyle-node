var CKStyle = require('../index').CKStyle

var css = '.a{ .b {box-sizing: border-box;}}'

var autoprefixer = require('autoprefixer')

var less = require('less')

function autoprefix(code, options) {
    code = autoprefixer.process(code, options).css
    return code
}

function lesser(code, options) {
    var parser = new(less.Parser)(options);
    parser.parse(code, function (err, tree) {
        var css = tree.toCSS({
            silent: options.silent,
            verbose: options.verbose,
            ieCompat: options.ieCompat,
            compress: options.compress,
            cleancss: options.cleancss,
            cleancssOptions: {},
            sourceMap: Boolean(options.sourceMap),
            sourceMapFilename: options.sourceMap,
            sourceMapURL: options.sourceMapURL,
            sourceMapOutputFilename: options.sourceMapOutputFilename,
            sourceMapBasepath: options.sourceMapBasepath,
            sourceMapRootpath: options.sourceMapRootpath || "",
            outputSourceFiles: options.outputSourceFiles,
            writeSourceMap: function() {},
            maxLineLen: options.maxLineLen,
            strictMath: options.strictMath,
            strictUnits: options.strictUnits,
            urlArgs: options.urlArgs
        });

        code = css;
    });

    return code;
}

console.log(CKStyle.parse(css))

var res = CKStyle.start(css, {
    fileName: 'a.css'
})
    .plugin(lesser, {
    })
    .plugin(autoprefix, {
        a: 1
    })
    .fix(function(res) {
        console.log(res)
    })
    .compress()
    .output(function(res) {
        console.log(res)
    })
console.log(res)



