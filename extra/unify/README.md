```javascript
var unify = require("./unify");
var mesh  = require("mesh");

var bus = mesh.wrap(function(operation, next) {
  console.log("execute"); //
  next(void 0, true);
});

bus = unify(bus, function(operation) {
  return operation.name === "getUser";
});

bus({ name: "getUser" });
bus({ name: "getUser" }); // converges on previous operation
bus({ name: "getUser" }); // converges on previous operation
```
