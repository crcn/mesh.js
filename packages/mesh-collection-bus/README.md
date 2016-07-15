This bus example enables you to execute `CRUD` actions against an array of items. Here's an example:

```javascript
var target = [];
var bus = CollectionDsBus.create(target);

await bus.execute({ action: "insert", data: { name: "blarg" } });
console.log(target); // [{ name: blarg }]
var cursor = bus.execute({ action: "load", query: { name: "blarg" } });

var item = await cursor.read();
console.log(item); // { name: blarg }

await bus.execute({ action: "update", query: { name: "blarg" }, data: { name: "jeff" }});
console.log(target); // [{ name: "jeff" }]

```
