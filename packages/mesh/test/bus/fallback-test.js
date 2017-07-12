var mesh = require('../..');

var FallbackBus = mesh.FallbackBus;
var Bus = mesh.Bus;
var BufferedBus = mesh.BufferedBus;
var AsyncResponse = mesh.AsyncResponse;
var Response = mesh.Response;
var EmptyResponse = mesh.EmptyResponse;
var expect = require('expect.js');
var co = require('co');
var timeout = require('../utils/timeout');

describe(__filename + '#', function() {

  it('is a bus', function() {
    expect(FallbackBus.create()).to.be.an(Bus);
  });

  it('sequentially executes busses until data is emitted by one of them', co.wrap(function*() {

    var bus = FallbackBus.create([
      BufferedBus.create(),
      BufferedBus.create(void 0, ['a', 'b', 'c']),
      BufferedBus.create(void 0, 'd')
    ]);

    var response = bus.execute();
    expect((yield response.read()).value).to.be('a');
    expect((yield response.read()).value).to.be('b');
    expect((yield response.read()).value).to.be('c');
    expect((yield response.read()).done).to.be(true);
  }));

  it('stops execution if an error occurs', co.wrap(function*() {

    var bus = FallbackBus.create([
      BufferedBus.create(new Error('an error')),
      BufferedBus.create(void 0, ['a'])
    ]);

    var err;
    var response = bus.execute();

    try {
      expect((yield response.read()).value).to.be('a');
    } catch (e) { err = e; }

    expect(err.message).to.be('an error');

    // TODO
    // expect((yield response.read()).done).to.be(true);
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

    var bus = FallbackBus.create(busses);
    expect((yield bus.execute({}).read()).value).to.be('a');
  }));


  it('can execute an operation against a bus that does not response a response', co.wrap(function*() {
    var bus = FallbackBus.create([
      { execute() { }}
    ]);

    var err;

    try {
      yield bus.execute({});
    } catch(e) { err = e; }

    expect(err).to.be(void 0);
  }));

   it("can cancel a response", co.wrap(function*() {
    var canceled = 0;
    var a = { execute: function(writable) {
      return Response.create(function(writable) {
        writable.then(function() {
          canceled++;
        });
      });
    }};

    var bus = FallbackBus.create([a, a]);

    var resp = bus.execute({});
    resp.cancel();
    yield timeout(10);
    expect(canceled).to.be(1);
  }));
});
