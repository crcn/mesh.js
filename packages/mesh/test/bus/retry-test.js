var mesh = require('../..');

var RetryBus = mesh.RetryBus;
var NoopBus = mesh.NoopBus;
var Bus = mesh.Bus;
var BufferedBus = mesh.BufferedBus;
var AsyncResponse = mesh.AsyncResponse;
var EmptyResponse = mesh.EmptyResponse;
var ErrorResponse = mesh.ErrorResponse;

var sift = require('sift');
var expect = require('expect.js');
var co = require('co');

describe(__filename + '#', function() {

  it('is a bus', function() {
    expect(RetryBus.create()).to.be.an(Bus);
  });

  it('can retry an operation twice if it fails', co.wrap(function*() {

    var retryCount = 0;

    var bus = RetryBus.create(
      2,
      {
        execute: function(operation) {
          retryCount++;
          return ErrorResponse.create(new Error('an error'));
        }
      }
    );

    var response = bus.execute({ name: 'op' });

    try { yield response.read() } catch(e) { }

    expect(retryCount).to.be(2);
  }));

  xit('can filter errors before retrying', co.wrap(function*() {


    var bus = RetryBus.create(
      3,
      function(error, operation) {
        return error.message.to.be('network error');
      },
      FallbackBus.create(
        AcceptBus.create(sift({ name: 'getGenericError' }), BufferedBus.create(new Error('generic error'))),
        AcceptBus.create(sift({ name: 'getNetworkError' }), BufferedBus.create(new Error('network error')))
      )
    );

    var response = bus.execute({ name: 'op' });

    try { yield response.read() } catch(e) { }

    expect(retryCount).to.be(2);
  }));
});
