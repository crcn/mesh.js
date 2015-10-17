var mesh = require('../..');

var RaceBus = mesh.RaceBus;
var NoopBus = mesh.NoopBus;
var Bus = mesh.Bus;
var BufferedBus = mesh.BufferedBus;
var AsyncResponse = mesh.AsyncResponse;
var EmptyResponse = mesh.EmptyResponse;
var DelayedBus    = mesh.DelayedBus;

var expect = require('expect.js');
var co = require('co');

describe(__filename + '#', function() {

  it('is a bus', function() {
    expect(RaceBus.create()).to.be.an(Bus);
  });

  it('executes all busses at the same time and returns data from the fastest one', co.wrap(function*() {

    var bus = RaceBus.create([
      DelayedBus.create(BufferedBus.create(void 0, 'a'), 10),
      DelayedBus.create(BufferedBus.create(void 0, 'b'), 0)
    ]);

    var response = bus.execute();
    expect((yield response.read()).value).to.be('b');
    expect((yield response.read()).done).to.be(true);
  }));

  it('stops execution if an error occurs', co.wrap(function*() {

    var bus = RaceBus.create([
      BufferedBus.create(new Error('an error')),
      BufferedBus.create(void 0, ['a'])
    ]);

    var err;
    var response = bus.execute();

    try {
      expect((yield response.read()).value).to.be('a');
    } catch (e) { err = e; }

    expect(err.message).to.be('an error');
  }));

  it('continues run operations if a bus has been removed', co.wrap(function*() {
    var busses = [
      {
        execute: function(operation) {
          busses.splice(0, 1);
          return EmptyResponse.create();
        }
      },
      BufferedBus.create(void 0, 'a')
    ];

    var bus = RaceBus.create(busses);
    expect((yield bus.execute({}).read()).value).to.be('a');
  }));

  it('properly ends if there is no data', co.wrap(function*() {
    var busses = [
      NoopBus.create(),
      NoopBus.create()
    ];

    var bus = RaceBus.create(busses);
    expect((yield bus.execute({}).read()).done).to.be(true);
  }));
});
