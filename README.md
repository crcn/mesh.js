

[![Build Status](https://travis-ci.org/mojo-js/crudlet.js.svg)](https://travis-ci.org/mojo-js/crudlet.js) [![Coverage Status](https://coveralls.io/repos/mojo-js/crudlet.js/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/crudlet.js?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/crudlet.js.svg)](https://david-dm.org/mojo-js/crudlet.js) [![Join the chat at https://gitter.im/mojo-js/crudlet.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mojo-js/crudlet.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Crudlet is a universal, [streamable](https://nodejs.org/api/stream.html) interface for data stores that works on any platform. Basically you
can use just about any database (or even your API) without it being coupled to your application.

#### Why?

- **Decoupled**. Crudlet allows you to decouple any store (even your own API) from your front-end / backend application. E.g: easily swap between realtime services like firebase, socket.io, parse, etc.
- **Interoperable**. Use Crudlet with just about any library, or framework.
- **Tiny**. Crudlet is only 11kb minified.
- **Isomorphic**. Easily use your application code on multiple platforms (client & server-side). Just swap out the database adapter.
- **Testable**. Crudlet makes it super easy to stub-out any data store for testing purposes. Super useful especially for server-side apps (e.g: stubbing-out mongodb).
- **Extensible**. Easily add offline-mode & peer-to-peer (realtime) with just a few lines of code.
<!--- **Mashable**. Mix & match data-stores to add additional functionality to your application.-->

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

```javascript
crud.open(db).write(crud.operation("insert", {
  collection: "friends",
  data: { name: "Blakers" }
}));
```

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

### Building a custom database

Building a custom database is pretty easy. All you need to do
is return a stream when `db(opName, options)` is called.

Here's some scaffolding for a custom db:

```javascript

// slimmed down version of node streams.
var stream = require("obj-stream");

function createDatabase(options) {

  // create database here

  // return fn that executes operations
  return function (operationName, options) {
    var writable = stream.writable();

    // this is important so that data can be piped to other things
    process.nextTick(function() {

      // collection MUST exist
      if (!options.collection) return writable.reader.emit("error", new Error("missing collection"));

      // perform task here

      // write data from insert/load
      writable.write(data);

      // must call end operation when complete
      writable.end();
    });

    return writable.reader;
  };
}
```

> Keep in mind that there are a few conventions you should follow when writing custom database adapters. These conventions are here to ensure that databases are interoperable with each other.

#### db(insert, options)

Insert a new item in the database. Note that `data` is emitted for each item inserted in the database.

- `options` - db options
  - `data` - data to insert. Accepts 1 or many items
  - `collection` - collection to insert (optional for dbs that don't have it)

```javascript
var _ = require("highland");
var peopleDb = crud.child(db, { collection: "people" });

// insert one item
peopleDb("insert", {
  data: { name: "jeff" }
});

// insert many items & collect the results in 1
// array
peopleDb("insert", {
  data: [
    { name: "Joe" },
    { name: "Rogan" }
  ]
}).pipe(_.pipeline(_.collect)).on("data", function(people) {

});
```

#### db(update, options)

Updates an item in the database. Doesn't return any values.

- `options`
  - `query` - search query for items to update
  - `data`  - data to merge with
  - `collection` - db collection
  - `multi` - `true` to update multiple items. `false` is default.

```javascript
var peopleDb = crud.child(db, { collection: "people" });

peopleDb("update", {
  query: { name: "jake" },
  data : { age: 17 }
});

// update multiple items
peopleDb("update", {
  multi: true,
  query: { name: "joe" },
  data : { age: 17 }
});
```

#### db(upsert, options)

Updates an item if it exists. Inserts an item if it doesn't.

- `options`
  - `query` - search query for items to update
  - `data`  - data to merge or insert
  - `collection` - db collection

```javascript
var peopleDb = crud.child(db, { collection: "people" });

// insert
peopleDb("upsert", {
  query: { name: "jake" },
  data : { name: "jake", age: 17 }
}).on("end", function() {

  // update
  peopleDb("upsert", {
    query: { name: "jake" },
    data : { name: "jake", age: 18 }
  })
});
```

#### db(load, options)

Loads one or many items from the database.

- `options`
  - `query` - search query for items
  - `collection` - db collection
  - `multi` - `true` if loading multiple. `false` is default.

```javascript

var peopleDb = crud.child(db, { collection: "people" });

// load one item
peopleDb("load", {
  query: { name: "tina" }
}).on("data", function() {
  // handle
});


// load many items
peopleDb("load", {
  multi: true,
  query: { name: "tina" }
}).pipe(_.pipeline(_.collect)).on("data", function(people) {
  // handle
});
```

#### db(remove, options)

Removes an item from the database.

- `options`
  - `query` - query to search
  - `collection` - collection to search
  - `multi` - `true` to remove multiple items

```javascript

// remove one item
db("remove", {
  collection: "people",
  query: { name: "batman" }
});


// remove all instances where age = 54
db("remove", {
  collection: "people",
  query: { age: 54 },
  multi: true
});
```
