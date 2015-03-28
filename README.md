Example:

```javascript
var crudlet = require("crudlet");
var localdb = require("crudlet-localdb");
var http    = require("crudlet-http");
var webrtc  = require("crudlet-webrtc");


var db = crudlet.parallel(localdb(), http(), webrtc());

var peopleDb = db.child(db, {
  collection: "people",
  http: {
    get: "/people",
    post: "/people",
    put: "/people/:data.uid",
    del: "/people/:data.uid"
  }
});

crudlet.run(peopleDb, "tail", { remote: true }).on("data", function() {

});

crudlet.run(peopleDb, "insert", { data: { name: "blarg" }}).on("data", function() {

});
```

#### crudlet.run(db, operationName, properties)

Creates a new operation

```javascript
var crudlet     = require("crudlet");
var localStore  = require("crudlet-local-storage");

var db = localStore();

crudlet.run(db, "load", { query: { name: "Oprah" }}).on("data", function(data) {

});
```

#### crudlet.operation(name, properties)

Creates a new operation

#### crudlet.parallel(...dbs)

Runs databases in parallel

```javascript
var crudlet     = require("crudlet");
var localstore  = require("crudlet-local-storage");
var http        = require("crudlet-http");

// load localstore at the same time as an http request
vr db = crudlet.parallel(localstore(), http());

// data will get emitted twice here
crudlet.run(db, "load", {
  query: {
    name: "Oprah"
  },
  collection: "people" // localstore specific
  get: "/people" // http specific
}).on("data", function(data) {

});
```

#### crudlet.sequence(...dbs)

Runs databases in sequence. Similar to parallel()

#### crudlet.child(db, operationProperties)

Creates a child db

#### crudlet.stream(db)

creates a db stream

```javascript
var crudlet = require("crudlet");
var localstore = require("crudlet-local-storage");
var db = localstore();
var opStream = crudlet.stream(db);

opStream.on("data", function() {

}).write(crudlet.operation("insert", { data: { name: "blah" }}));
```

#### crudlet.operation(name, properties)

creates a new operation

#### crudlet.delta()

applies delta change on piped data from a db operation

```javascript
var crudlet = require("crudlet");
var memorystore = require("crudlet-memory");

var db = memorystore();

var opStream = crudlet.stream(db);
opStream.pipe(crudlet.delta()).on("data", function(data) {
  console.log(data);
});
opStream.write(crudlet.operation("update", { data: { name: "craig" }})); // delta { name: craig }
opStream.write(crudlet.operation("update", { data: { name: "craig", age: 17 }})); // delta { age: 17 }
```


<!--

```javascript
var through = require("through2");


function createDb() {

  var store = [];

  return function () {
    return through.obj(function(operation, enc, next) {
      if (operation.name === "insert") insert.call(this, operation, enc, next);
      if (operation.name === "update") update.call(this, operation, enc, next);
      if (operation.name === "remove") remove.call(this, operation, enc, next);
      if (operation.name === "load")   load.call(this, operation, enc, next);
    });
  }

  function insert (data) {

  }

  function update (data) {

  }

  function update (data) {

  }
}
```

-->
