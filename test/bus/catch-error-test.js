var mesh = require('../..');

var CatchErrorBus = mesh.CatchErrorBus;
var Bus = mesh.Bus;
var BufferedBus = mesh.BufferedBus;
var co = require('co');
var expect = require('expect.js');

describe(__filename + '#', function() {

  it('is a bus', function() {
    expect(CatchErrorBus.create()).to.be.an(Bus);
  });

  it('eats errors that have been caught', co.wrap(function*(next) {
    var caughtError;
    var bus = CatchErrorBus.create(BufferedBus.create(new Error('an error')), function(error, operation) {
      caughtError = error;
      expect(operation.name).to.be('op1');
    });

    yield bus.execute({ name: 'op1' }).read();
    expect(caughtError.message).to.be('an error');
  }));

  it('can re-throw ', co.wrap(function*(next) {

    var bus = CatchErrorBus.create(BufferedBus.create(new Error('an error')), function(error, operation) {
      throw new Error('uncaught error');
    });

    var err;
    try {
      var resp = bus.execute();
      yield yield resp.read();
    } catch(e) { err = e; }
    expect(err.message).to.be('uncaught error');
  }));
});
