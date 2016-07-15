
mesh-mongodb is a streamable interface for the [Mongodb](https://www.mongodb.org/) library. See additional action documentation here: http://meshjs.herokuapp.com/docs/database-adapters.

#### installation

```
npm install mesh-mongodb
```

Basic Example:

```javascript
var mesh = require("mesh");
var mongodb = require("mesh-mongodb");

var db = mongodb("mongodb://localhost:27017/mesh-test");
db(mesh.op("insert", { data: { name: "blarg" }})).on("data", function() {

});
```


#### db mongodb(host)

creates a local meshelt database

- `options` - options for the local db
  - `name` - name of db (optional)
  - `store` - store to use
