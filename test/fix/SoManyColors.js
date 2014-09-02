var doFix = require('./helper').doFix;

exports.doTest = function() {
    css = ".ui-dialog .ui-dialog-content .btn.confirm {\n\
  background-color: #2996e3;\n\
  background-image: -moz-linear-gradient(top, #2692de, #2d9deb);\n\
  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#2692de), to(#2d9deb));\n\
  background-image: -webkit-linear-gradient(top, #2692de, #2d9deb);\n\
  background-image: -o-linear-gradient(top, #2692de, #2d9deb);\n\
  background-image: linear-gradient(to bottom, #2692de, #2d9deb);\n\
  background-repeat: repeat-x;\n\
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff2692', endColorstr='#ff2d9d', GradientType=0);\n\
  color: #ffffff;\n\
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);\n\
  border-color: #2D9DEB;\n\
}";

    expected = ".ui-dialog .ui-dialog-content .btn.confirm {\n\
    border-color: #2D9DEB;\n\
    background-image: -webkit-gradient(linear,0 0,0 100%,from(#2692DE),to(#2D9DEB));\n\
    background-image: -webkit-linear-gradient(top,#2692DE,#2D9DEB);\n\
    background-image: -moz-linear-gradient(top,#2692DE,#2D9DEB);\n\
    background-image: -o-linear-gradient(top,#2692DE,#2D9DEB);\n\
    background-color: #2996E3;\n\
    background-repeat: repeat-x;\n\
    background-image: linear-gradient(to bottom,#2692DE,#2D9DEB);\n\
    color: #FFF;\n\
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FF2692',endColorstr='#FF2D9D',GradientType=0);\n\
    text-shadow: 0 1px 1px rgba(255,255,255,.75);\n\
}";

    var result = doFix(css, '')
    var fixer = result[0]
    var msg = result[1]
    equal(expected, msg, 'so many colors are ok');
}