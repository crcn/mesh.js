import { AcceptBus, Response } from 'mesh';
import sift from 'sift';

export default {
  create: function(bus) {
    return AcceptBus.create(sift({ type: 'upsert' }), {
      execute: function(action) {
        return Response.create(async function(writable) {

          var chunk = await bus.execute({
            type           : 'load',
            query          : operation.query,
            collectionName : operation.collectionName
          }).read();

          writable.write((await bus.execute({
            type           : !chunk.done ? 'update' : 'insert',
            data           : operation.data,
            query          : operation.query,
            collectionName : operation.collectionName
          }).read()).value);

          writable.close();
        });
      }
    }, bus);
  }
}
