var mesh = require('../..');

var Response = mesh.Response;
var EmptyResponse = mesh.EmptyResponse;
var co = require('co');
var expect = require('expect.js');

describe(__filename + '#', function() {

    it('is a Response', function() {
      expect(EmptyResponse.create()).to.be.an(Response);
    });

  it('returns undefined when read is called', co.wrap(function*() {
    var response = EmptyResponse.create();

    // sanity check to ensure read() never returns a value
    for (var i = 10; i--;) {
      expect((yield response.read()).done).to.be(true);
    }
  }));

  it('calls then() immediately after it\'s called', co.wrap(function*() {
    var response = EmptyResponse.create();
    response.read();
    yield new Promise(function(resolve, reject) {
      response.then(resolve);
    });
  }));

  it('can be yielded', co.wrap(function*() {
    var response = EmptyResponse.create();
    response.read();
    yield response;
    yield response;
    yield response;
    yield response;
  }));
});
