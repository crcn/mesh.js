import MemoryBus from './memory';
import expect    from 'expect.js';

describe(__filename + '#', function() {
  it('can be created', function() {
    MemoryBus.create();
  });

  it('throws an error if the collection is not defined', async function() {
    var e;
    try {
      var bus = MemoryBus.create();
      await bus.execute({ action: 'insert' }).read();
    } catch(err) { e = err; }
    expect(e.message).to.contain('must not be undefined');
  });

  it('noops if the operation is not supported by the bus', async function() {
    var bus = MemoryBus.create();
    await bus.execute({ action: 'doesNotExist' }).read();
  });

  it('can insert & load data from the mem bus', async function() {
    var bus = MemoryBus.create();
    var {value} = await bus.execute({ action: 'insert', collection: 'items', data: { id: 1 } }).read();
    expect(value.id).to.be(1);
    var {value} = await bus.execute({ action: 'load', collection: 'items', query: { id: 1 }}).read();
    expect(value.id).to.be(1);
  });

  it('will only load one item if multi=false', async function() {
    var bus = MemoryBus.create();
    var data = await bus.execute({ action: 'insert', collection: 'items', data: { id: 1 } }).read();
    var data = await bus.execute({ action: 'insert', collection: 'items', data: { id: 1 } }).read();
    var data = await bus.execute({ action: 'insert', collection: 'items', data: { id: 1 } }).read();
    expect(data.value.id).to.be(1);
    var data = await bus.execute({ action: 'load', collection: 'items', query: { id: 1 }}).readAll();
    expect(data.length).to.be(1);
  });

  it('will multiple items if multi=true', async function() {
    var bus = MemoryBus.create();
    var data = await bus.execute({ action: 'insert', collection: 'items', data: { id: 1 } }).read();
    var data = await bus.execute({ action: 'insert', collection: 'items', data: { id: 1 } }).read();
    var data = await bus.execute({ action: 'insert', collection: 'items', data: { id: 1 } }).read();
    expect(data.value.id).to.be(1);
    var data = await bus.execute({ action: 'load', collection: 'items', multi: true, query: { id: 1 }}).readAll();
    expect(data.length).to.be(3);
  });

  it('can update data in a collection', async function() {
    var bus = MemoryBus.create();
    var data = await bus.execute({ action: 'insert', collection: 'items', data: { id: 1 } }).read();
    expect(data.value.id).to.be(1);
    var updatedData = await bus.execute({ action: 'update', collection: 'items', data: { id: 1, action: 'blarg' }, query: { id: 1 }}).read();
    expect(updatedData.value.action).to.be('blarg');
    expect(data.value.name).to.be(void 0);
  });

  it('can remove an item from the collection', async function() {
    var bus = MemoryBus.create();
    var data = await bus.execute({ action: 'insert', collection: 'items', data: { id: 1 } }).read();
    expect(data.value.id).to.be(1);
    var data = await bus.execute({ action: 'load', collection: 'items', query: { id: 1 }}).readAll();
    expect(data.length).to.be(1);
    await bus.execute({ action: 'remove', collection: 'items', query: { id: 1 }}).readAll();
    var data = await bus.execute({ action: 'load', collection: 'items', query: { id: 1 }}).readAll();
    expect(data.length).to.be(0);
  });
});
