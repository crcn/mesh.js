var mesh = require('../..');

var Response = mesh.Response;
var ErrorResponse = mesh.ErrorResponse;
var co = require('co');
var expect = require('expect.js');

describe(__filename + '#', function() {
  it('returns an error', co.wrap(function*() {
    var resp = new ErrorResponse(new Error('an error'));
    var err;
    try {
      yield resp.read();
    } catch(e) { err = e; }
    expect(err.message).to.be('an error');
  }));

  it('calls catch() immediately', function(next) {
    var resp = new ErrorResponse(new Error('an error'));
    resp.catch(function(error) {
      next();
    });
  });
});
