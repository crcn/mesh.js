[![Build Status](https://travis-ci.org/mojo-js/crudlet.js.svg)](https://travis-ci.org/mojo-js/crudlet.js) [![Coverage Status](https://coveralls.io/repos/mojo-js/crudlet.js/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/crudlet.js?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/crudlet.js.svg)](https://david-dm.org/mojo-js/crudlet.js) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mojo-js/crudlet.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)


Crudlet (create/read/update/delete) provides a common, streamable interface for data stores. This library
is still a work in progress, and pretty **alpha** at this point.

More info here soon.

<!--
#### Why?

- Decoupled. Crudlet provides a common interface for all your data stores. Mix & match whatever you want.
- Flexible. Stuff like realtime data & offline-mode is pretty simple to add.
- Interoperable.
- Extensible. Based off node streams.
-->

#### Adapters

- [pubnub](http://github.com/crcn/crudlet-pubnub)
- [webrtc](http://github.com/crcn/crudlet-webrtc)
- [http](http://github.com/crcn/crudlet-http)
- [local storage](http://github.com/crcn/crudlet-local-storage)
- [memory](http://github.com/crcn/crudlet-memory)
- mongodb - soon
- redis - soon

#### Examples

- [realtime todo list](examples/todos)

#### Installation

```
npm install crudlet
```

#### Example:

```javascript
var crud          = require("crudlet");
var localStorage  = require("crudlet-local-storage");
var pubnub        = require("crudlet-pubnub");

var remotedb = pubnub({
  key    : "pubnub key",
  secret : "pubnub secret"
});

// local storage db
var localdb  = localStorage();

// pipe all operations from pubnub back to local sturage
remotedb("tail").pipe(crudlet.open(localdb));

// use this as the main db - pass all operations to local storage, and pubnub
var db = crud.parallel(localdb, remotedb);

// get the people DB
var peopleDb = db.child(db, {
  collection: "people"
});

// add a new person to local storage & pubnub
peopleDb("insert", { data: { name: "Oprah" }});
peopleDb("insert", { data: { name: "Gordon" }});
```

#### db(operationName, properties)

runs a new operation

```javascript
var crud       = require("crudlet");
var localStore = require("crudlet-local-storage");

var db = localStore();

db("load", { query: { uid: "uid" }}).on("data", function() {

});

```

#### crudlet.parallel(...dbs)

Runs databases in parallel

```javascript
var crud        = require("crudlet");
var localstore  = require("crudlet-local-storage");
var http        = require("crudlet-http");

// load localstore at the same time as an http request
vr db = crud.parallel(localstore(), http());

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
var crud = require("crudlet");
var localstore = require("crudlet-local-storage");
var db = localstore();
var _ = require("highland");

_([
  crud.operation("insert", { data: { name: "blah" }}),
  crud.operation("insert", { data: { name: "blarg" }})
]).
pipe(crud.open(db)).
on("data", function() {

});


```

#### operation crudlet.operation(name, properties)

creates a new operation

#### crudlet.delta()

applies delta change on piped data from a db operation

```javascript
var crud = require("crudlet");
var memorystore = require("crudlet-memory");

var db = memorystore();

var opStream = crud.stream(db);
opStream.pipe(crud.delta()).on("data", function(data) {
  console.log(data);
});
opStream.write(crud.operation("update", { data: { name: "craig" }})); // delta { name: craig }
opStream.write(crud.operation("update", { data: { name: "craig", age: 17 }})); // delta { age: 17 }
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
