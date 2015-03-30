Example:

```javascript
var crudlet  = require("crudlet");
var caplet   = require("caplet");
var localdb  = require("crudlet-localdb");
var http     = require("crudlet-http");
var webrtc   = require("crudlet-webrtc");
var _        = require("highland");

var db = crudlet.parallel(localdb(), http(), webrtc());

var peopleDb = db.child(db, {
  collection: "people"
});

var Person = caplet.createModelClass({
  initialize: function() {
    this.opStream = crudlet.open(peopleDb).pipe(crudlet.delta()).on("data", this.set.bind(this, "data"));
  }, 
  load: function() {
    this.opStream.write(crudlet.operation("insert", { data: this }));
  },
  save: function() {
    this.opStream.write(crudlet.operation(this.uid ? "insert" : "update", { data: this }));
  }
});

```

#### db(operationName, properties)

runs a new operation

```javascript
var crudlet    = require("crudlet");
var localStore = require("crudlet-local-storage");
var _          = require("highland");

var db = localStore();

db("load", { query: { uid: "uid" }}).on("data", function() {
  
});

```

#### crudlet.parallel(...dbs)

Runs databases in parallel

```javascript
var crudlet     = require("crudlet");
var localstore  = require("crudlet-local-storage");
var http        = require("crudlet-http");

// load localstore at the same time as an http request
vr db = crudlet.parallel(localstore(), http());

// data will get emitted twice here
db("load", {
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

#### crudlet.open(db)

creates a db stream

```javascript
var crudlet = require("crudlet");
var localstore = require("crudlet-local-storage");
var db = localstore();
var _ = require("highland");

_([
  crudlet.operation("insert", { data: { name: "blah" }}),
  crudlet.operation("insert", { data: { name: "blarg" }})
]).
pipe(crudlet.open(db)).
on("data", function() {
  
});


```

#### operation crudlet.operation(name, properties)

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
