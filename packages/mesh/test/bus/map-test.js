var mesh = require('../..');

var MapBus = mesh.MapBus;
var Bus = mesh.Bus;
var BufferedBus = mesh.BufferedBus;

var expect = require('expect.js');
var co = require('co');

describe(__filename + '#', function() {

  it('is a bus', function() {
    expect(MapBus.create()).to.be.an(Bus);
  });

  it('can map a chunk of data into something else', co.wrap(function*() {
    var bus = MapBus.create(BufferedBus.create(void 0, 'chunk'), function(chunk, writable, operation) {
      expect(operation.name).to.be('op');
      chunk.split('').forEach(writable.write.bind(writable));
    });

    var response = bus.execute({ name: 'op' });

    var chunks = [];
    var chunk;
    while(chunk = yield response.read()) {
      if (chunk.done) break;
      chunks.push(chunk.value);
    }

    expect(chunks.length).to.be(5);
    expect(chunks.join('-')).to.be('c-h-u-n-k');
  }));

  it('passes errors down', co.wrap(function*() {
    var mapped = false;
    var bus = MapBus.create(BufferedBus.create(new Error('an error')), function(chunk, writable, operation) {
      mapped = true;
    });

    var err;

    try {
      yield bus.execute().read();
    } catch(e) { err = e; }

    expect(err.message).to.be('an error');
    expect(mapped).to.be(false);
  }));

  it('catches errors in the map function and passes them down', co.wrap(function*() {
    var mapped = false;
    var bus = MapBus.create(BufferedBus.create(void 0, 'chunk'), function(chunk, writable, operation) {
      mapped = true;
      throw new Error('an error');
    });

    var err;

    try {
      yield bus.execute().read();
    } catch(e) { err = e; }

    expect(err.message).to.be('an error');
    expect(mapped).to.be(true);
  }));
});
