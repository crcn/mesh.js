var mesh = require('../..');
var RoundRobinBus = mesh.RoundRobinBus;
var BufferedBus = mesh.BufferedBus;
var Bus = mesh.Bus;
var expect = require('expect.js');
var co = require('co');
var _ = require('lodash');

describe(__filename + '#', function() {

  it('is a bus', function() {
    expect(RoundRobinBus.create()).to.be.an(Bus);
  });

  it('can executes operations in a round-robin fashion', co.wrap(function*() {

    var bus = RoundRobinBus.create([
      BufferedBus.create(void 0, 'a'),
      BufferedBus.create(void 0, 'b'),
      BufferedBus.create(void 0, 'c')
    ]);

    var buffer = [];
    var n = 10;

    // a bit dirty, but should give us a sequence of random characters
    for (var i = n; i--;) {
      buffer.push((yield bus.execute().read()).value);
    }

    expect(buffer.join('')).to.be('abcabcabca');
  }));
});
