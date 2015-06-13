

```javascript
var join   = require("./join");
var memory = require("mesh-memory");
var mesh   = require("mesh");

var bus = memory();
bus     = join(bus);

bus = mesh.limit(1, bus);

bus({ name: "insert", collection: "people", data: { id: 1, name: "jeff", friends: [2, 3]}});
bus({ name: "insert", collection: "people", data: { id: 2, name: "abe", friends: [1, 3]}});
bus({ name: "insert", collection: "people", data: { id: 3, name: "sarah", friends: [1, 1]}});

bus({
  name: "load",
  multi: true,
  collection: "people",
  join: {
    friends: function(data) {
      return bus({
        name: "load",
        collection: "people",
        query: { id: {$in: data.friends } }
      });
    }
  }
}).on("data", function(person) {
  // { name: "jeff", friends: [{ name: "abe" }, { name: "sarah" }]}
});

```
