var assert = require("assert")

// 测试中需要的数据全部都在这里准备好

global.ckstyle = require('../ckstyle');

global.equal = function(a, b) {
    assert.equal(a, b);
}

global.ok = function(a) {

}

