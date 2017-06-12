var mesh = require('../..');

var Response = mesh.Response;
var BufferedResponse = mesh.BufferedResponse;

var expect = require('expect.js');
var co = require('co');

describe(__filename + '#', function() {
  it('is a response', function() {
    expect(BufferedResponse.create()).to.be.an(Response);
  });

  it('can created a buffered response with no content', co.wrap(function*() {
    var response = BufferedResponse.create();
    expect((yield response.read()).done).to.be(true);
  }));

  it('can return an error', co.wrap(function*() {
    var response = BufferedResponse.create(new Error('an error'));
    var err;

    try {
      yield response.read();
    } catch(e) { err = e; }

    expect(err.message).to.be('an error');
  }));

  it('can return one chunk', co.wrap(function*() {
    var response = BufferedResponse.create(void 0, 'a');
    expect((yield response.read()).value).to.be('a');
    expect((yield response.read()).done).to.be(true);
  }));

  it('can return many chunks', co.wrap(function*() {
    var response = BufferedResponse.create(void 0, ['a', 'b']);
    expect((yield response.read()).value).to.be('a');
    expect((yield response.read()).value).to.be('b');
    expect((yield response.read()).done).to.be(true);
  }));

  it('calls then() immediately', function(next) {
    var response = BufferedResponse.create(void 0, ['a', 'b']);
    response.read();
    response.read();
    response.read();
    response.then(function() {
      next();
    });
  });

  it('calls catch() when an error occurs', function(next) {
    var response = BufferedResponse.create(new Error('an error'));
    response.read();
    response.catch(function() {
      next();
    });
  });
});
