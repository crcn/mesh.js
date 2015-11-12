var expect       = require('expect.js');
var RemoteBus    = require('./index');
var mesh         = require('mesh');
var EventEmitter = require('events').EventEmitter;
var co           = require('co');
var TailableBus  = require('mesh-tailable-bus');
var ParallelBus  = mesh.ParallelBus;

describe(__filename + '#', function() {

  it('can create a bus', function() {
    RemoteBus.create(createAdapter(), mesh.NoopBus);
  });

  function createAdapter(em) {
    if (!em) em = new EventEmitter();
    return {
      addMessageListener : em.on.bind(em, 'message'),
      sendMessage        : em.emit.bind(em, 'message')
    };
  }


  it('can return data from a remote source', co.wrap(function*() {
    var bus = RemoteBus.create(createAdapter(), mesh.WrapBus.create(function(operation) {
      return mesh.BufferedResponse.create(void 0, 'data');
    }));

    var chunks = yield bus.execute({ action: 'load' }).readAll();
    expect(chunks[0]).to.be('data');
  }));

  it('properly sends back an error', co.wrap(function*() {
    var bus = RemoteBus.create(createAdapter(), mesh.WrapBus.create(function(operation) {
      return mesh.BufferedResponse.create(new Error('error!'));
    }));

    var err;
    try {
      yield bus.execute({ action: 'load' }).readAll();
    } catch (e) {
      err = e;
    }

    expect(err.message).to.be('error!');
  }));

  it('ignores remote operations from being re-used', co.wrap(function*() {
    var bus = RemoteBus.create(createAdapter(), mesh.WrapBus.create(function(operation) {
      return mesh.Response(function(writable) {
        bus.execute(operation).pipeTo(writable);
      });
    }));

    var chunks = yield bus.execute({ }).readAll();
    expect(chunks.length).to.be(0);
  }));

  it('can flag an operation to not look for a response', co.wrap(function*() {
    var bus = RemoteBus.create(createAdapter(), mesh.WrapBus.create(function(operation) {
      return mesh.BufferedResponse.create(void 0, 'abba');
    }));

    var chunks = yield bus.execute({ resp: false }).readAll();
    expect(chunks.length).to.be(0);
  }));

  it('can run a tail on a remote operation stream', co.wrap(function*() {
    var bus = RemoteBus.create(createAdapter(), mesh.WrapBus.create(function(operation) {
      return mesh.BufferedResponse.create(void 0, operation);
    }));

    bus = TailableBus.create(bus);

    var tail = bus.createTail();
    var tailed = [];
    tail.pipeTo({
      write: tailed.push.bind(tailed),
      abort: function() {},
      close: function() {}
    });

    var ops;

    yield bus.execute({ action: 'insert' });
    yield bus.execute({ action: 'insert' });
    yield bus.execute({ action: 'insert' });
    yield bus.execute({ action: 'insert' });

    yield {
      next: function(next) {
        setTimeout(next, 0);
      }
    }

    expect(tailed.length).to.be(4);
  }));

  it('can emit the same operation to multiple clients', co.wrap(function*() {
    var i = 0;

    var bus = RemoteBus.create(createAdapter(), mesh.WrapBus.create(function(operation) {
      return mesh.BufferedResponse.create(void 0, operation);
    }));

    var bus2 = RemoteBus.create(createAdapter(), mesh.WrapBus.create(function(operation) {
      return mesh.BufferedResponse.create(void 0, operation);
    }));

    var bus3 = ParallelBus.create([bus, bus2]);

    var chunks = yield bus3.execute({ }).readAll();
    expect(chunks.length).to.be(2);
  }));

  it('removes an operation that has ended', co.wrap(function*() {
    var bus = RemoteBus.create(createAdapter(), {
      execute: function(operation) {
        return {
          pipeTo: function(writable) {
            writable.write('data');
            writable.close();
            writable.write('chunk');
          }
        }
      }
    });

    var chunks = yield bus.execute({ }).readAll();
    expect(chunks.length).to.be(1);
  }));
});
