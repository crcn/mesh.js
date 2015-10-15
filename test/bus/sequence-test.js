var mesh = require('../..');

var SequenceBus = mesh.SequenceBus;
var NoopBus = mesh.NoopBus;
var Bus = mesh.Bus;
var BufferedBus = mesh.BufferedBus;
var AsyncResponse = mesh.AsyncResponse;
var EmptyResponse = mesh.EmptyResponse;
var ErrorResponse = mesh.ErrorResponse;


var co = require('co');
var expect = require('expect.js');

describe(__filename + '#', function() {

  it('is a bus', function() {
    expect(new SequenceBus()).to.be.an(Bus);
  });

  it('executes ops against multiple busses and joins the read() data', co.wrap(function*() {

    var bus = new SequenceBus([
      new BufferedBus(void 0, 'a'),
      new BufferedBus(void 0, 'b')
    ]);

    var response = bus.execute();

    expect((yield response.read()).value).to.be('a');
    expect((yield response.read()).value).to.be('b');
    expect((yield response.read()).done).to.be(true);
  }));

  it('skips a bus that was removed during execution', co.wrap(function*() {

    var rmbus = {
      execute: function(operation) {
        busses.splice(1, 1); // remove the next bus
        return new EmptyResponse();
      }
    };

    var busses = [new BufferedBus(void 0, 'a'), rmbus, new BufferedBus(void 0, 'b'), new BufferedBus(void 0, 'c')];

    var bus = new SequenceBus(busses);
    var response = bus.execute(busses);

    expect((yield response.read()).value).to.be('a');
    expect((yield response.read()).value).to.be('b');
    expect((yield response.read()).value).to.be('c');
  }));

  it('passes errors down', co.wrap(function*() {
    var bus = new SequenceBus([new BufferedBus(new Error('unknown error'))]);
    var err;

    try {
      yield bus.execute({}).read();
    } catch (e) { err = e; }

    expect(err.message).to.be('unknown error');
  }));
});
