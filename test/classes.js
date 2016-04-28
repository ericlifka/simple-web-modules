var should = require('should');
var SM = require('../index');

describe('SM Classes', function () {

  describe('SM.event', function () {
    it('should return the same function', function () {
      var fn = function () {};
      var ret = SM.event(fn);

      ret.should.be.exactly(fn);
    });

    it('should set an identifier on the function', function () {
      var fn = function () {};
      SM.event(fn);

      fn.should.have.property('isSMEvent');
    });
  });

  describe('SM.DefineClass', function () {
    it('should return a constructor function', function () {
      var cl = SM.DefineClass();
      (typeof cl).should.equal("function");
    });

    it('should expose properties on instances', function () {
      var cl = SM.DefineClass([{
        propA: 1,
        propB: function () {}
      }]);
      var obj = new cl();

      obj.should.have.property('propA');
      obj.should.have.property('propB');
      obj.should.not.have.ownProperty('propA');
      obj.should.not.have.ownProperty('propB');
    })
  });
});
