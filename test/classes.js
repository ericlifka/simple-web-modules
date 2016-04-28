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
});
