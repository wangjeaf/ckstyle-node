var ExtraStatement = require('./helper').ExtraStatement

exports.doTest = function () {
    _basic()
    _opm()
    _other()
}

function _basic() {
    stmt = new ExtraStatement('@import', '@import url("fjdaslkjfdsa")', null)
    ok(stmt.extra, '@import is extra statement')
    equal(stmt.operator, '@import', 'operator is @important')
    equal(stmt.statement, '@import url("fjdaslkjfdsa")', 'statement is ok')
    equal(stmt.styleSheet, null, 'no style sheet')
    ok(stmt.isImport(), 'yes, it is import statement')
    ok(!stmt.isOpmOperator(), 'no, it is not opm operator')
}

function _opm() {
    stmt = new ExtraStatement('@-css-compiler-xxx', '@-css-compiler-xxx fdjafdjafda;', null)
    ok(stmt.isOpmOperator(), 'yes, it is opm operator')

    stmt = new ExtraStatement('@-css-compiler-xxx', '@-css-compiler-xxx fdjafdjafda;', null)
    ok(stmt.isOpmOperator(), 'yes, it is opm operator')
}

function _other() {
    stmt = new ExtraStatement('@namspace', '@namspace fdjafdjafda;', null)
    ok(!stmt.isOpmOperator(), 'no, it is not opm operator')
    ok(!stmt.isImport(), 'no, it is not import')

    stmt = new ExtraStatement('@charset', '@charset utf-8;', null)
    ok(!stmt.isOpmOperator(), 'no, it is not opm operator')
    ok(!stmt.isImport(), 'no, it is not import')
}