var expect = require('expect.js');
var mesh   = require('mesh');
var co     = require('co');

exports.create = function(createBus, options) {

  if (!options) options = {};

  var cases = [];

  function it(desc, run) {
    cases.push({ description: desc, run: co.wrap(run) });
  }

  var bus;

  beforeEach(function() {
    bus = createBus();
  });

  function *insert(collection, data) {
    return yield bus.execute({ collectionName: collection, type: 'dsInsert', data: data });
  }

  function *findOne(collection, query) {
    return yield bus.execute({ collectionName: collection, type: 'dsFind', query: query }).read();
  }

  function *findOne(collection, query) {
    return yield bus.execute({ collectionName: collection, type: 'dsFind', query: query }).read();
  }

  function *findMulti(collection, query, options) {
    return yield bus.execute(Object.assign({ collectionName: collection, type: 'dsFind', query: query, multi: true }, options || {})).readAll();
  }

  function *removeOne(collection, query) {
    return yield bus.execute({ collectionName: collection, type: 'dsRemove', query: query }).read();
  }

  function *updateOne(collection, query, data) {
    return yield bus.execute({ collectionName: collection, type: 'dsUpdate', query: query, data: data }).read();
  }

  function *updateMultiple(collection, query, data) {
    return yield bus.execute({ collectionName: collection, type: 'dsUpdate', multi: true, query: query, data: data }).readAll();
  }

  it('can insert() data into a collection', function*() {
    yield insert('letters', { name: 'a' });
    var item = yield findOne('letters', { name: 'a' });
    expect(item.value.name).to.be('a');
  });

  it('can remove() one item from a collection', function*() {
    yield insert('letters', { name: 'a' });
    yield removeOne('letters', { name: 'a' });;
    expect((yield findOne('letters', { name: 'a' })).done).to.be(true);
  });

  it('can update() one item in a collection', function*() {
    yield insert('letters', { name: 'a', last: 'b' });
    yield insert('letters', { name: 'a', last: 'd' });
    var item = yield updateOne('letters', { name: 'a' }, { name: 'b', last: 'c' });
    // expect(item.done).to.be(true);
    var item = (yield findOne('letters', { name: 'a' })).value;
    expect(item).not.to.be(void 0);
  });

  it('can update() multiple items in a collection', function*() {
    yield insert('letters', { name: 'a', last: 'b' });
    yield insert('letters', { name: 'a', last: 'd' });
    var items = yield updateMultiple('letters', { name: 'a' }, { name: 'b', last: 'c' });
    // expect(items.length).to.be(2);
    var item = (yield findOne('letters', { name: 'a' })).value;
    expect(item).to.be(void 0);
  });

  it('finds one item if multi isn not true', function*() {
      yield insert('letters', { name: 'a', last: 'b' });
      yield insert('letters', { name: 'a', last: 'c' });
      var items = yield findMulti('letters', { name: 'a' }, { multi: false });
      expect(items.length).to.be(1);
  });

  it('can find() multiple items from a collection', function*() {

    yield insert('letters', { name: 'a', last: 'b' });
    yield insert('letters', { name: 'a', last: 'c' });
    yield insert('letters', { name: 'a', last: 'd' });
    yield insert('letters', { name: 'a', last: 'e' });

    var items = yield findMulti('letters', { name: 'a' });
    expect(items.length).to.be(4);
  });

  if (options.hasCollections) {
    it('throws an error if "collection" doesn\'t exist in the action', function*() {
      var err;
      try {
        yield insert(void 0, {});
      } catch(e) {
        err = e;
      }
      expect(err).not.to.be(void 0);
    });
  }

  return cases;
}
