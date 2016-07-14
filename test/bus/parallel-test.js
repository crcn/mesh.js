var mesh = require('../..');

var ParallelBus = mesh.ParallelBus;
var Bus = mesh.Bus;
var BufferedBus = mesh.BufferedBus;
var AsyncResponse = mesh.AsyncResponse;
var EmptyResponse = mesh.EmptyResponse;
var DelayedBus    = mesh.DelayedBus;

var co = require('co');
var expect = require('expect.js');

describe(__filename + '#', function() {

  it('is a bus', function() {
    expect(ParallelBus.create()).to.be.an(Bus);
  });

  it('executes ops against multiple busses and joins the read() data', co.wrap(function*() {

    var bus = ParallelBus.create([
      BufferedBus.create(void 0, 'a'),
      BufferedBus.create(void 0, 'b')
    ]);

    var response = bus.execute();

    expect((yield response.read()).value).to.be('a');
    expect((yield response.read()).value).to.be('b');
    expect((yield response.read()).done).to.be(true);
  }));

  it('can receive data from any bus in any order', co.wrap(function*() {

    var bus = ParallelBus.create([
      DelayedBus.create(BufferedBus.create(void 0, 'a'), 30),
      DelayedBus.create(BufferedBus.create(void 0, 'b'), 20),
      DelayedBus.create(BufferedBus.create(void 0, 'c'), 10)
    ]);

    var response = bus.execute();

    expect((yield response.read()).value).to.be('c');
    expect((yield response.read()).value).to.be('b');
    expect((yield response.read()).value).to.be('a');
    expect((yield response.read()).done).to.be(true);
  }));

  it('passes errors down', co.wrap(function*() {
    var bus = ParallelBus.create([
      BufferedBus.create(new Error('error'))
    ]);

    var response = bus.execute();
    var err;

    try {
      yield bus.execute().read();
    } catch (e) { err = e; }

    expect(err.message).to.be('error');
  }));

  it('can continue to execute ops if a bus is removed mid-operation', co.wrap(function*() {
    var busses;
    var bus = ParallelBus.create(busses = [
      {
        execute: function(operation) {
          busses.splice(0, 1);
          return EmptyResponse.create();
        }
      },
      BufferedBus.create(void 0, 'a')
    ]);
    var response = bus.execute();
    expect((yield response.read()).value).to.be('a');
  }));

  it('can execute an operation against a bus that does not response a response', co.wrap(function*() {
    var bus = ParallelBus.create([
      { execute() { }}
    ]);

    var err;

    try {
      yield bus.execute({}).read();
    } catch(e) { err = e; }

    expect(err).to.be(void 0);
  }));

  it('does not close the stream before a handler is finished', co.wrap(function*() {
    var bus = ParallelBus.create([BufferedBus.create(void 0, [1, 2, 3, 4])]);

    var results = yield bus.execute({}).readAll();
    expect(results).to.eql([1, 2, 3, 4]);
  }));
});
