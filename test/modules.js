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

  it('should run a provided main module', function () {
    var called = false;
    SM.DefineModule('main', function () {
      called = true;
    });

    called.should.equal(false);
    SM.runMain();
    called.should.equal(true);
  });

  it('should provide require fn which provides access to other modules', function () {
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
  });

  it('should support requiring down multiple levels', function () {
    var called = false;
    SM.DefineModule('level-3', function () {
      called = true;
      return 'level-3';
    });

    SM.DefineModule('level-2', function (r) {
      return r('level-3') + ' level-2';
    });

    SM.DefineModule('level-1', function (r) {
      return r('level-2') + ' level-1';
    });

    SM.DefineModule('main', function (r) {
      r('level-1').should.equal('level-3 level-2 level-1');
    });

    SM.runMain();
    called.should.equal(true);
  });

});
