var mesh = require('mesh');
var TailableBus = require('./index');
var BufferedBus = mesh.BufferedBus;
var NoopBus     = mesh.NoopBus;
var expect = require('expect.js');
var co = require('co');

function *timeout(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

describe(__filename + '#', function() {
  it('can tailable operations on a bus', co.wrap(function*() {
    var bus = TailableBus.create(BufferedBus.create(void 0, 'ab'));
    var i = 0;
    bus.createTail().read().then(function(chunk) {
      expect(chunk.value.action).to.be('insert');
      i++;
    });
    var resp = bus.execute({ action: 'insert' });
    expect(i).to.be(0);
    yield resp.read();
    expect(i).to.be(0);
    yield resp.read();
    yield timeout(0); // ended - wait for a sec for async promise
    expect(i).to.be(1);
  }));

  it('can close a tail', co.wrap(function*() {
    var bus = TailableBus.create(NoopBus.create());
    var i = 0;
    var tail = bus.createTail();
    function pump() {
      return tail.read().then(function(chunk) {
        if (chunk.done) return Promise.resolve();
        i++;
        return pump();
      })
    }
    pump();
    yield bus.execute().read();
    yield bus.execute().read();
    yield timeout(0);
    expect(i).to.be(2);
    tail.cancel();
    yield bus.execute().read();
    yield timeout(0);
    expect(i).to.be(2);
  }));
});
