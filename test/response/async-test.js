var mesh = require('../..');

var WrapBus = mesh.WrapBus;

var Response = mesh.Response;
var AsyncResponse = mesh.AsyncResponse;

var co = require('co');
var expect = require('expect.js');

describe(__filename + '#', function() {

  it('is a Response', function() {
    expect(AsyncResponse.create()).to.be.an(Response);
  });

  it('runs the provided callback function in the constructor', co.wrap(function*() {
    var response = AsyncResponse.create(function(response) {
      response.write('a');
      response.write('b');
      response.end();
    });

    expect((yield response.read()).value).to.be('a');
    expect((yield response.read()).value).to.be('b');
    expect((yield response.read()).value).to.be(void 0);
  }));

  it('can continue to read after the response has ended', co.wrap(function*() {
    var response = AsyncResponse.create(function(response) {
      response.end();
    });
    yield response.read();
    yield response.read();
    yield response.read();
    yield response.read();
  }));

  it('can pass an error down', co.wrap(function*() {
    var response = AsyncResponse.create(function(writable) {
      writable.abort(new Error('something went wrong'));
    });

    var err;

    try {
      yield response.read();
    } catch (e) { err = e; }

    expect(err.message).to.be('something went wrong');
  }));

  it('wait for a chunk to be read before writing', co.wrap(function*() {

    var writeCounts = 0;

    var response = AsyncResponse.create(co.wrap(function*(writable) {
      writeCounts++;
      yield writable.write('a');
      writeCounts++;
      yield writable.write('b');
      writeCounts++;
      yield writable.write('c');
      writeCounts++;
      yield writable.end();
      writeCounts++;
    }));

    expect(writeCounts).to.be(1);
    expect((yield response.read()).value).to.be('a');
    expect(writeCounts).to.be(2);
    expect((yield response.read()).value).to.be('b');
    expect(writeCounts).to.be(3);
    expect((yield response.read()).value).to.be('c');
    expect(writeCounts).to.be(4);
    expect((yield response.read()).done).to.be(true);
    expect(writeCounts).to.be(4);
  }));

  it('automatically ends the async response if the runnable provided returns a promise', co.wrap(function*() {
    var response = AsyncResponse.create(co.wrap(function*(writable) {
      writable.write('a');
      writable.write('b');
    }));

    expect((yield response.read()).value).to.be('a');
    expect((yield response.read()).value).to.be('b');
    expect((yield response.read()).done).to.be(true);
  }));

  it('automatically handles errors that are thrown within an async runnable', co.wrap(function*() {
    var response = AsyncResponse.create(co.wrap(function*(writable) {
      writable.write('a');
      writable.write('b');
      throw new Error('an error');
    }));

    // eat the first value - error will get emitted asynchronously
    yield response.read();

    var err;
    try {
      yield response.read();
    } catch(e) { err = e; }

    expect(err.message).to.be('an error');
  }));

  it('always returns an error once set to the async response', co.wrap(function*() {
    var response = AsyncResponse.create(co.wrap(function*(writable) {
      writable.write('a');
      throw new Error('an error');
    }));

    var errors = [];

    // eat the first chunk
    yield response.read();

    for (var i = 10; i--;)
    try {
      yield response.read();
    } catch(e) { errors.push(e) };

    expect(errors.length).to.be(10);
  }));

  it('calls then() after completing', function(next) {
    var response = AsyncResponse.create(function(writable) {
      writable.end();
    });

    response.then(function() {
      next();
    });

    response.read();
  });

  it('calls then() when an error is emitted', function(next) {
    var response = AsyncResponse.create(function(writable) {
      writable.abort(new Error('an error'));
    });

    response.then(function(){}, function(error) {
      expect(error.message).to.be('an error');
      next();
    });

    response.read();
  });

  it('calls catch() when an error is emitted', function(next) {
    var response = AsyncResponse.create(function(writable) {
      writable.abort(new Error('an error'));
    });

    response.catch(function(error) {
      expect(error.message).to.be('an error');
      next();
    });

    response.read();
  });
});
