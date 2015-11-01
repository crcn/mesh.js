Creates an in-memory data store bus.


```javascript
var target = [];
var bus = MemoryDsBus.create(target);

await bus.execute({ action: "insert", collection: 'people', data: { name: "blarg" } });
console.log(target); // [{ name: blarg }]
var cursor = bus.execute({ action: "load", collection: 'people', query: { name: "blarg" } });

var item = await cursor.read();
console.log(item); // { name: blarg }

await bus.execute({ action: "update", collection: 'people', query: { name: "blarg" }, data: { name: "jeff" }});
console.log(target); // [{ name: "jeff" }]

```
