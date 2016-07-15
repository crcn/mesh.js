import { AcceptBus, FallbackBus, Response } from 'mesh';
import sift from 'sift';

export default {
  create: function(localBus, remoteBus) {
    return AcceptBus.create(sift({ action: 'load' }), FallbackBus.create([
      localBus,
      {
        execute: function(action) {
          return new Response(async function(writable) {
            try {
              var resp = remoteBus.execute(action);
              var value;
              var done;
              while({value, done} = await resp.read()) {
                if (done) break;
                writable.write(value);
                await localBus.execute({ action: 'insert', collection: action.collection, data: value }).read();
              }
              writable.close();
            } catch(e) {
              writable.abort(e);
            }
          });
        }
      }
    ]), remoteBus);
  }
};
