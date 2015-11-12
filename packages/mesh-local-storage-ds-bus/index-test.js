var LocalStorageDsBus = require('./index');
var MemoryDsBus       = require('mesh-memory-ds-bus');
var dsTestCases       = require('mesh-ds-bus-test-cases');
var co                = require('co');
var expect            = require('expect.js');

describe(__filename + "#", function() {

  dsTestCases.create(LocalStorageDsBus.create.bind(LocalStorageDsBus), {
    hasCollections: true
  }).forEach(function(tc) {
    it(tc.description, tc.run);
  });

  it('can load data from local storage', co.wrap(function*() {
    var memBus = MemoryDsBus.create();
    yield memBus.execute({ action: 'insert', data: { name: 'a' }, collection: 'as' });

    var store = {
      get() {
        return memBus.toJSON();
      }
    };

    var localStorageBus = LocalStorageDsBus.create({
      store: store
    });

    var chunk = yield localStorageBus.execute({ action: 'load', collection: 'as', query: { name: 'a' }}).read();
    expect(chunk.value.name).to.be('a');
  }));

  it('calls set when persisting', co.wrap(function*() {
    var setCount = 0;
    var store = {
      get() {},
      set(key, value) {
        setCount++;
      }
    };

    var localStorageBus = LocalStorageDsBus.create({
      store: store
    });

    yield localStorageBus.execute({ action: 'insert', collection: 'as', data:  { name: 'a' }});
    yield localStorageBus.execute({ action: 'remove', collection: 'as', query: { name: 'a' }});
    yield localStorageBus.execute({ action: 'remove', collection: 'as', query: { name: 'a' }});

    expect(setCount).to.be(3);
  }));
});
