var should = require('should');
var SM = require('../index');

describe('SM Modules', function () {

  it('should exist', function () {
    should.exist(SM);
    SM.should.have.property('DefineModule');
  });

  it('should run a provided main module', function (done) {
    var called = false;
    SM.DefineModule('main', function () {
      called = true;
    });

    called.should.equal(false);
    SM.runMain();
    called.should.equal(true);

    done();
  });

});
