var mesh = require('../..');
var co = require('co');
var expect = require('expect.js');
var AttachDefaultsBus = mesh.AttachDefaultsBus;
var Bus = mesh.Bus;
var BufferedResponse = mesh.BufferedResponse;

describe(__filename + '#', function() {
  it('is a bus', function() {
    expect(AttachDefaultsBus.create()).to.be.an(Bus);
  });

  it('can attach default properties to a running operation', co.wrap(function*() {
    var bus = AttachDefaultsBus.create({ c: 'd' }, {
      execute: function(operation) {
        return BufferedResponse.create(void 0, operation);
      }
    });

    var ret = (yield bus.execute({ a: 'b' }).read()).value;

    expect(ret.a).to.be('b');
    expect(ret.c).to.be('d');
  }));

  it('does not override properties on the operation', co.wrap(function*() {
    var bus = AttachDefaultsBus.create({ a: 1, c: 'd' }, {
      execute: function(operation) {
        return BufferedResponse.create(void 0, operation);
      }
    });

    var ret = (yield bus.execute({ a: 'b' }).read()).value;

    expect(ret.a).to.be('b');
    expect(ret.c).to.be('d');
  }));
});
