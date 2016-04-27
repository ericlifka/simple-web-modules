var should = require('should');
var SM = require('../index');

describe('SM Modules', function () {

  beforeEach(function() {
    SM.hardReset();
  });

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

  it('should provide require fn which provides access to other modules', function (done) {
    var called = false;
    SM.DefineModule('test-a', function () {
      called = true;
      return {
        name: 'test-a'
      };
    });

    SM.DefineModule('main', function (r) {
      var testA = r('test-a');

      should.exist(testA);
      testA.should.have.property('name', 'test-a');
    });

    SM.runMain();
    called.should.equal(true);

    done();
  });

});
