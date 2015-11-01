import { Bus } from 'mesh';
import CollectionBus from './collection';
import expect from 'expect.js';
import { timeout } from 'common/test/utils';

describe(__filename + '#', function() {

  it('can be created', function() {
    expect(CollectionBus.create()).to.be.an(Bus);
  });

  it('can execute insert() operations against the collection', async function() {
    var source = [];
    var bus = CollectionBus.create(source);
    await bus.execute({ action: 'insert', data: 'a' }).read();
    expect(source.length).to.be(1);
    expect(source[0]).to.be('a');
  });

  it('can execute remove() operations against the collection', async function() {
    var source = ['a', 'b', 'c'];
    var bus = CollectionBus.create(source);
    await bus.execute({ action: 'remove', query: 'a' }).read();
    expect(source.length).to.be(2);
    expect(source.join('')).to.be('bc');
  });

  it('can execute update() operations against the collection', async function() {
    var source = ['a', 'b', 'c'];
    var bus = CollectionBus.create(source);
    await bus.execute({ action: 'update', query: 'a', data: 'd' }).read();
    expect(source.length).to.be(3);
    expect(source.join('')).to.be('dbc');
  });

  it('can execute load() operations against the collection', async function() {
    var source = [5, 6, 7, 8, 9, 10];
    var bus = CollectionBus.create(source);
    var items = await bus.execute({ action: 'load', query: { $gt: 7 } }).readAll();
    expect(items.length).to.be(3);
    expect(items.join('')).to.be('8910');
  });
});
