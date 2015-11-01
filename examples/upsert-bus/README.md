This bus enables you to execute `upsert` operations against a data store bus.

```javascript
var items = [];
var bus = CollectionDsBus.create(items);
bus     = UpsertBus.create(bus);

var data =

await bus.execute({ action: 'upsert', data: { name: 'blarg', _id: 1 }, query: { _id: 1 }});
console.log(items); // { name: 'blarg', _id: 1 }
await bus.execute({ action: 'upsert', data: { name: 'marco', _id: 1 }, query: { _id: 1 }});  
console.log(items); // { name: 'marco', _id: 1 }
```
