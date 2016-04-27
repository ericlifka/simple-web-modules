var should = require('should');
var SM = require('../index');

describe('SM Modules', function () {
  it('should exist', function () {
    should.exist(SM);
    SM.should.have.property('DefineModule');
  });
});
