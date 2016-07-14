import { AcceptBus, Response } from 'mesh';
import sift from 'sift';

export default {
  create: function(bus) {
    return AcceptBus.create(sift({ type: 'upsert' }), {
      execute: function(action) {
        return Response.create(async function(writable) {

          var chunk = await bus.execute({
            action     : 'load',
            query      : operation.query,
            collection : operation.collection
          }).read();

          writable.write((await bus.execute({
            action     : !chunk.done ? 'update' : 'insert',
            data       : operation.data,
            query      : operation.query,
            collection : operation.collection
          }).read()).value);

          writable.close();
        });
      }
    }, bus);
  }
}
