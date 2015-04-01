[![Build Status](https://travis-ci.org/mojo-js/crudlet.js.svg)](https://travis-ci.org/mojo-js/crudlet.js) [![Coverage Status](https://coveralls.io/repos/mojo-js/crudlet.js/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/crudlet.js?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/crudlet.js.svg)](https://david-dm.org/mojo-js/crudlet.js) [![Join the chat at https://gitter.im/mojo-js/crudlet.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mojo-js/crudlet.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Crudlet is a universal, [streamable](https://nodejs.org/api/stream.html) interface for data stores that works on any platform. Basically that means that you
can use any database (or even your API) without it being coupled to your application. Crudlet also allows you to do some pretty fancy stuff too.

#### Why?

- Decoupled. Crudlet allows you to decouple any store (even your own API) from your front-end / backend application.
- Vendor lock-in. Using Crudlet means that you're not locked into any particular data store, e.g:  easily swap between realtime services like firebase, socket.io, parse, etc.
- Interoperable. Easily use your application code on multiple platforms (client & server-side). Just swap out the database adapter.
- Testable. Crudlet makes it super easy to stub-out any data store for testing purposes. Super useful especially for server-side apps (e.g: stubbing-out mongodb).
- Extensible. Easily add offline-mode & peer-to-peer (realtime) with just a few lines of code.
- Mashable. Mix & match data-stores to add additional functionality to your application.

#### Installation

```
npm install crudlet
```

#### Adapters

- [pubnub](http://github.com/mojo-js/crudlet-pubnub) - realtime db
- [loki](http://github.com/mojo-js/crudlet-loki) - in-memory database
- [memory](http://github.com/mojo-js/crudlet-memory) - another in-memory database
- [local-storage](http://github.com/mojo-js/crudlet-local-storage) - local storage database
- [webrtc](http://github.com/mojo-js/crudlet-webrtc) - webrtc adapter 

#### Example

Below is an example of a realtime DB that uses [pubnub](https://github.com/mojo-js/crudlet-pubnub), and [local storage](https://github.com/mojo-js/crudlet-local-storage).

```javascript
var crud          = require("crudlet");
var pubnub        = require("crudlet-pubnub");
var localStorage  = require("crudlet-local-storage");

// store data locally on the users machine
var localdb = localStorage();

// pubnub adapter for sending operations to other connected clients
var pubdb   = pubnub({
  publishKey   : "publish key",
  subscribeKey : "subscribe key",
  channel      : "chatroom"
});

// the actual DB we're going to use. Pass
// all operations to localstorage, and pubnub
var db = crud.parallel(localdb, pubdb);

// tail all operations send to pubnub back into the database. Note
// that remote calls won't get re-published to pubnub
pubdb("tail").pipe(crud.open(db));

// create a child database - collection will get passed to each operation
var peopleDb = crud.child(db, { collection: "people" });

// insert some people
peopleDb("insert", {
  data: [
    { name: "Gordon Ramsay" },
    { name: "Ben Stiller"   }
  ]
}).on("data", function() {
  // handle data here
});
```

<!--
#### More Examples

Use SAME DB for same app

- realtime todos (local storage + pubnub)
- distributed event bus (server + client + socket.io)
- offline-mode (save queries)
- TTL on local storage + http
- file sharing
- chatroom
-->


#### [stream.Readable](https://nodejs.org/api/stream.html#stream_class_stream_readable) db(operationName, options)

Runs a new operation.

> Note that the supported operations & required options may change depending on the data store you're using.

```javascript
var localStorage = require("crudlet-local-storage");

var localdb = localStorage();
localdb("insert", {
  collection: "people",
  data: { name: "Arnold Schwarzenegger" }
}).on("data", function() {
  // handle data here
});
```

#### [stream.Stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) crud.open(db)

Creates a new operation stream.

```javascript
var operationStream = crud.open(db);

// emitted when the operation is performed
operationStream.on("data", function() {

});

operationStream.write(crud.operation("insert", {
  collection: "people",
  data: { name: "Sandra Bullock" }
}));

operationStream.write(crud.operation("remove", {
  collection: "people",
  query: { name: "Jeff Goldbloom" }
}));
```

#### operation db.operation(name, option)

creates a new operation which can be written to a database stream. See `crud.open(db)`.

<!--
```javascript
var localStorage = require("crudlet-local-storage");
var pubnub       = require("crudlet-pubnub");

var pubdb = pubnub({
  subscribeKey: "sub key",
  publishKey: "pub key",
  channel: "channel"
});


pubdb("tail").on("data", function(operation) {

});

```
-->

#### db crud.child(db, options)

Creates a new child database. `options` is essentially just added to each operation performed.

```javascript
var peopleDb = crud.child(db, { collection: "people" });

// insert a new person into the people collection
peopleDb("insert", {
  data: { name: "Shrek" }
});
```

#### db crud.tailable(db, reject)

Makes the db tailable. This simply allows you to listen for any operations invoked on a db such as `create`, `update`, `remove`, and `load`.

`reject` is an array of operations to ignore. Default is `[load]`.

```javascript
var db = crud.tailable(localdb);
db("tail", function() {

});

db("insert", { data: { name: "Donkey" }}); // trigger tail
db("remove", { query: { name: "Donkey" }}); // trigger tail
db("update", { query: { name: "Donkey" }, data: { name: "Donkay" }}); // trigger tail
db("load", { query: { name: "Donkey" }}); // ignored by tail
```

#### db crud.parallel(...dbs)

Combines databases and executes operations in parallel.

<!-- note about emitting data multiple times -->

```javascript
var db = crud.parallel(localdb, httpdb);

// execute "load" on localdb at the same time
db("load").on("data", function() {
  // Note that his will get called TWICE
}).on("end", function() {
  // called when operation is executed on all dbs
});
```

#### db crud.sequence(...dbs)

Combines databases and executes operations in sequence.

<!-- note about emitting data multiple times -->

```javascript
var db = crud.parallel(localdb, httpdb);

// load data from localdb first, then move to httpdb
db("load").on("data", function() {
  // Note that his will get called TWICE
});
```

<!-- docs on crud -->


<!--
### Creating a DB adapter

The crudlet API is
-->
