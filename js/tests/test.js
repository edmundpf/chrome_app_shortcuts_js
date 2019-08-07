var assert, m, should;

m = require('../utils/createIcon').main;

assert = require('chai').assert;

should = require('chai').should();

//: Test Constructor
describe('main()', function() {
  return it('Is function', function() {
    return m.should.be.a('function');
  });
});

//::: End Program :::
