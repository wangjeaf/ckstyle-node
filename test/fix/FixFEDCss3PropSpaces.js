var doFix = require('./helper').doFix;

exports.doTest = function() {
    _base()
    _value_prefix();
}


function _base() {
    var result = doFix('.test {-webkit-border-radius: 3px;-moz-border-radius:3px;border-radius:3px;}', '')
    msg = result[1]
    equal(msg, '.test {\n    -webkit-border-radius: 3px;\n       -moz-border-radius: 3px;\n            border-radius: 3px;\n}', 'ok')

    var result = doFix('.test {border-radius:3px;}', '')
    var msg = result[1]
    equal(msg, '.test {\n    border-radius: 3px;\n}', 'ok')
}

function _value_prefix() {
    var result = doFix(".dropdown .dropdown-hd {\n\
  display: block;\n\
  padding-left: 10px;\n\
  padding-right: 10px;\n\
  background-image: -webkit-gradient(linear,0 0,0 100%,from(#F8F8F8),to(#EEE));\n\
  background-image: -webkit-linear-gradient(top,#F8F8F8,#EEE);\n\
  background-image: -khtml-linear-gradient(top,#F8F8F8,#EEE);\n\
  background-image: -moz-linear-gradient(top,#F8F8F8,#EEE);\n\
  background-image: -ms-linear-gradient(top,#F8F8F8,#EEE);\n\
  background-image: linear-gradient(top,#F8F8F8,#EEE); \n\
  background-image: -o-linear-gradient(top,#F8F8F8,#EEE); \n\
}")

    var expected = ".dropdown .dropdown-hd {\n\
    display: block;\n\
    padding-left: 10px;\n\
    padding-right: 10px;\n\
    background-image: -webkit-gradient(linear,0 0,0 100%,from(#F8F8F8),to(#EEE));\n\
    background-image: -webkit-linear-gradient(top,#F8F8F8,#EEE);\n\
    background-image:  -khtml-linear-gradient(top,#F8F8F8,#EEE);\n\
    background-image:    -moz-linear-gradient(top,#F8F8F8,#EEE);\n\
    background-image:     -ms-linear-gradient(top,#F8F8F8,#EEE);\n\
    background-image:      -o-linear-gradient(top,#F8F8F8,#EEE);\n\
    background-image:         linear-gradient(top,#F8F8F8,#EEE);\n\
}"
    
    equal(result[1], expected, 'value contains css3 prefix, is ok')
}