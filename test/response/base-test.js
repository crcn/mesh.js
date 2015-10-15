var Response = require('../..').Response;
var expect = require('expect.js')
var extend = require('../../internal/extend');

describe(__filename + '#', function() {
  it('can be created via the create() static method', function() {
    expect(Response.create()).to.be.an(Response);
  });

  it('copies the create() method when the bus is subclassed', function() {
    function SubResponse() {

    }
    extend(Response, SubResponse);
    expect(SubResponse.create()).to.be.an(Response);
  });

  it('can extend() a base class', function() {
    expect(Response.extend().create()).to.be.an(Response);
  });
});
