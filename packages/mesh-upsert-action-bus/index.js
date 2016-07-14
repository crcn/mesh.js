import { AcceptBus, Response } from 'mesh';
var mesh = require('mesh');
var sift = require('sift');

module.exports = {
  create: function(bus) {
    return mesh.AcceptBus.create(sift({ type: 'upsert' }), {
      execute: function(action) {
        return mesh.Response.create(async function(writable) {

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
