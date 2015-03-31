[![Build Status](https://travis-ci.org/mojo-js/crudlet.js.svg)](https://travis-ci.org/mojo-js/crudlet.js) [![Coverage Status](https://coveralls.io/repos/mojo-js/crudlet.js/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/crudlet.js?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/crudlet.js.svg)](https://david-dm.org/mojo-js/crudlet.js) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mojo-js/crudlet.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Crudlet is a universal, [streamable](https://nodejs.org/api/stream.html) interface for data stores that works on any platform. Basically that means that you
can use any database (or even your API) without it being coupled to your application. Crudlet also allows you to do some pretty fancy stuff too.

#### Why?

- Decoupled. Crudlet allows you to decouple any store (even your own API) from your front-end / backend application.
- Vendor lock-in. Using Crudlet means that you're not locked into any particular data store, e.g:  easily swap between realtime services like firebase, socket.io, parse, etc.
- Interoperable. Easily use your application code on multiple platforms (client & server-side). Just swap out the database adapter.
- Testable. Crudlet makes it super easy to stub-out any data store for testing purposes. Super useful especially for server-side apps (e.g: stubbing-out mongodb).
- Extensible. Easily add offline-mode & peer-to-peer (realtime) with just a few lines of code.
- Mashable. Mix & match data-stores to add additional functionality to your application.

#### Databases

- [pubnub](http://github.com/crcn/crudlet-pubnub) - [pubnub](http://www.pubnub.com/) (realtime data)
- [webrtc](http://github.com/crcn/crudlet-webrtc) - via [PeerJS](http://peerjs.com/) (realtime data)
- [http](http://github.com/crcn/crudlet-http) - meant to work with *your* API
- [local storage](http://github.com/crcn/crudlet-local-storage) - local storage in the browser
- [memory](http://github.com/crcn/crudlet-memory) - in-memory database
- [loki](http://github.com/mojo-js/crudlet-loki) - [loki](http://lokijs.org/) in-memory datbase
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

// pipe all operations from pubnub back to local storage
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

```javascript
var db = localStorage();
var peopleDb = crud.child(db, { collection: "people" });

// load from just the people collection
peopleDb("load").on("data", function() {

});
```

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
