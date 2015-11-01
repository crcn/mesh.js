import UpsertBus from './upsert';
import CollectionBus from '../collection-ds-bus';
import expect from 'expect.js';

describe(__filename + '#', function() {
  it('inserts a primitive item if it does not exist', async function() {

    var source = [0, 1, 2, 3];

    var bus = CollectionBus.create(source);
    bus     = UpsertBus.create(bus);

    await bus.execute({
      action: 'upsert',
      data: 4,
      query: 4
    });

    expect(source.length).to.be(5);
  });

  it('updates a primitive if it exists', async function() {

    var source = [0, 1, 2, 3];

    var bus = CollectionBus.create(source);
    bus     = UpsertBus.create(bus);

    await bus.execute({
      action: 'upsert',
      data: 4,
      query: 2
    });

    expect(source.length).to.be(4);
    expect(source[2]).to.be(4);
  });
});
