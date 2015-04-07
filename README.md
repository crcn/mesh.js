[![Build Status](https://travis-ci.org/mojo-js/mesh.js.svg)](https://travis-ci.org/mojo-js/mesh.js) [![Coverage Status](https://coveralls.io/repos/mojo-js/mesh.js/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/mesh.js?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/mesh.js.svg)](https://david-dm.org/mojo-js/mesh.js) [![Join the chat at https://gitter.im/mojo-js/mesh.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mojo-js/mesh.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Mesh is a universal interface for communicating with data sources whether it's your API, mongodb, pubnub, webrtc, socket.io, redis, or local storage. Easily build sophisticated features such as offline-mode, realtime data, rollbacks, and more with little effort.

Mesh is entirely customizable, and doesn't make assumptions about how a data source works. You can easily build your own API adapter that's interoperable with all the other mesh plugins.

Here's a basic example of how you might implement an API that caches temporarily to local storage:

```javascript
var mesh = require("mesh");
var http = require("mesh-http");
var localStorage = require("mesh-local-storage");

// local storage cache - keep stuff for one minute max
var cache = localStorage({
	ttl: 1000 * 60
});
var api = http({
	prefix: "/api"
});

// pipe all persistence operations to the cache
api(mesh.op("tail")).pipe(mesh.open(cache));

// the DB we'll use, return the first result returned, and
// only pass 'load' operations to the cache
var db = mesh.first(mesh.accept("load", cache), api);


db(mesh.op("insert", {
	collection: "people"

	// path is automatically resolved from the collection param,
	// but you can easily override it.
	path: "/people",

	// POST is resolved from the operation name, but it's
	// also overridable
	method: "POST",

	data: {
		name: "john"
	}
})).on("data", function(personData) {

	// load the person saved. This should result in a cache
	// hit for local storage. Also note that the HTTP path & method
	// will automatically get resolved.
	db(mesh.op("load", {
		collection: "people",
		query: {
			name: person.name
		}
	})).
	on("data", function(personData) {
		// do stuff with data
	});
});
```

#### Highlights

- Streamable interface.
- Works with any library, or framework.
- Works on any platform.
- Tiny (11kb).
- Works nicely with other stream-based libraries such as [highland](http://highlandjs.org/).
- Isomorphic. Easily use different databases for different platforms.
- Easily testable. Stub out any database for a fake one.
- Simple design. Use it for many other things such as an event bus, message-queue service, etc.

#### Installation

```
npm install mesh
```

Or via bower:

```
bower install mesh
```

#### Adapters

- [pubnub](http://github.com/mojo-js/mesh-pubnub) - [pubnub](http://www.pubnub.com/) sync adapter
- [socket.io](http://github.com/mojo-js/mesh-socket.io) - [socket.io](http://socket.io/) sync adapter
- [webrtc](http://github.com/mojo-js/mesh-webrtc) - [webrtc](http://www.webrtc.org/) sync adapter
- [loki](http://github.com/mojo-js/mesh-loki) - [loki](http://lokijs.org/#/) in-memory database
- [memory](http://github.com/mojo-js/mesh-memory) - another in-memory database
- [local-storage](http://github.com/mojo-js/mesh-local-storage) - local storage database
- [http](http://github.com/mojo-js/mesh-http) - HTTP adapter
- [mongodb](http://github.com/mojo-js/mesh-mongodb) - Mongodb Adapter (server-side)

#### Examples

- [collaborative todos](http://crudlet.herokuapp.com/#/live-todos)
- [api + models](https://github.com/mojo-js/mesh-http#http--caplet-example)
- [web worker DB](http://crudlet.herokuapp.com/#/live-web-workers)
- [collaborative drawing](http://crudlet.herokuapp.com/#/live-scribble)


#### Realtime Example

Below is an example of a realtime DB that uses [pubnub](https://github.com/mojo-js/mesh-pubnub), and [local storage](https://github.com/mojo-js/mesh-local-storage).

```javascript
var mesh = require("mesh");
var pubnub = require("mesh-pubnub");
var localStorage = require("mesh-local-storage");

// store data locally on the users machine
var localdb = localStorage();

// pubnub adapter for sending operations to other connected clients
var pubdb = pubnub({
	publishKey: "publish key",
	subscribeKey: "subscribe key",
	channel: "chatroom"
});

// the actual DB we're going to use. Pass
// all operations to localstorage, and pubnub
var db = mesh.parallel(localdb, pubdb);

// tail all operations from pubnub to the local DB. Note
// that remote operations don't get re-sent to pubnub.
pubdb(mesh.op("tail")).pipe(mesh.open(db));

// create a child database - collection will get passed to each operation
var peopleDb = mesh.child(db, {
	collection: "people"
});

// insert some people
peopleDb(mesh.op("insert", {
	data: [
    {	name: "Gordon Ramsay" },
    {	name: "Ben Stiller" }
  ]
})).on("data", function() {
	// handle data here
});
```

#### [stream.Readable](https://nodejs.org/api/stream.html#stream_class_stream_readable) db(operationName, options)

Runs a new operation.

> Note that the supported operations & required options may change depending on the data store you're using.

```javascript
var localStorage = require("mesh-local-storage");

var localdb = localStorage();
localdb(mesh.operation("insert", {
	collection: "people",
	data: { name: "Arnold Schwarzenegger" }
})).on("data", function() {
	// handle data here
});
```

#### [stream.Stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) mesh.open(db)

Creates a new operation stream.

```javascript
var operationStream = mesh.open(db);

// emitted when the operation is performed
operationStream.on("data", function() {

});

operationStream.write(mesh.operation("insert", {
	collection: "people",
	data: { name: "Sandra Bullock" }
}));

operationStream.write(mesh.operation("remove", {
	collection: "people",
	query: { name: "Jeff Goldbloom" }
}));
```

#### operation db.operation(name, option)

creates a new operation which can be written to a database stream. See `mesh.open(db)`.

```javascript
mesh.open(db).write(mesh.operation("insert", {
	collection: "friends",
	data: { name: "Blakers" }
}));
```

#### operation mesh.op(name, options)

shorthand for `mesh.operation(name options)`.

#### db mesh.top(db)

`to operation` - Makes it so that you can simply call `db(operationName, options)` instead of passing in the operation
each time.

```javascript
var db = mesh.top(localStorage());

// enables this
db("insert", {
	collection: "people",
	data: { name: "Jorge" }
});

// also accepts this
db(mesh.operation("insert"));
```

#### db mesh.child(db, options)

Creates a new child database. `options` is essentially just added to each operation performed.

```javascript
var peopleDb = mesh.top(mesh.child(db, { collection: "people" }));

// insert a new person into the people collection
peopleDb("insert", {
  data: { name: "Shrek" }
});
```

#### db mesh.tailable(db, reject)

Makes the db tailable. This simply allows you to listen for any operations invoked on a db such as `create`, `update`, `remove`, and `load`.

`reject` is an array of operations to ignore. Default is `[load]`.

```javascript
var db = mesh.tailable(localdb);
db("tail", function() {

});

var peopleDb = mesh.top(mesh.child(db, { collection: "people" }));

peopleDb("insert", { data: { name: "Donkey" }}); // trigger tail
peopleDb("remove", { query: { name: "Donkey" }}); // trigger tail
peopleDb("update", { query: { name: "Donkey" }, data: { name: "Donkay" }}); // trigger tail
peopleDb("load", { query: { name: "Donkey" }}); // ignored by tail
```

#### db mesh.parallel(...dbs)

Combines databases and executes operations in parallel.

<!-- note about emitting data multiple times -->

```javascript
var db = mesh.parallel(localdb, httpdb);

// execute "load" on localdb at the same time
db(mesh.op("load")).on("data", function() {
  // Note that his will get called TWICE
}).on("end", function() {
  // called when operation is executed on all dbs
});
```

#### db mesh.sequence(...dbs)

Combines databases and executes operations in sequence.

<!-- note about emitting data multiple times -->

```javascript
var db = mesh.top(mesh.sequence(localdb, httpdb));

// load data from localdb first, then move to httpdb
db("load").on("data", function() {
  // Note that his will get called TWICE
});
```

#### db mesh.first(...dbs)

Runs dbs in sequence, but stops when a result is emitted from a database.

```javascript
var db = mesh.top(mesh.first(localStorage(), http()));

// load data from local storage if it exists, or continue
// to http storage
db("load", { collection: "people" }).on("data", function() {

});
```

#### db mesh.accept([...operationNames, ]db)

Accepts only the provided operations.

```javascript
// main DB - api server
var httpdb = mesh.tailable(http());

// temporary cache
var localdb = localStorage();

// main DB - get cached data from local storage before
// checking the server
var db = mesh.first(mesh.accept("load", localdb), httpdb);

// pipe all persistence operations back to local storage
httpdb(mesh.op("tail")).pipe(mesh.open(localdb));
```


#### db mesh.reject([...operationNames, ]db)

Runs all operations except the ones provided.

<!--#### db mesh.intercept()

Intercepts an operation based on the given test-->

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
	return function(operation) {
		var writable = stream.writable();

		// this is important so that data can be piped to other things
		process.nextTick(function() {

			// collection MUST exist
			if (!operation.collection) return writable.reader.emit("error", new Error("missing collection"));

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
var peopleDb = mesh.top(mesh.child(db, { collection: "people" }));

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
var peopleDb = mesh.top(mesh.child(db, {
	collection: "people"
}));

peopleDb("update", {
	query: { name: "jake"	},
	data: { age: 17 }
});

// update multiple items
peopleDb("update", {
	multi: true,
	query: { name: "joe" },
	data: {	age: 17 }
});
```

#### db(upsert, options)

Updates an item if it exists. Inserts an item if it doesn't.

- `options`
  - `query` - search query for items to update
  - `data`  - data to merge or insert
  - `collection` - db collection

```javascript
var peopleDb = mesh.top(mesh.child(db, {
	collection: "people"
}));

// insert
peopleDb("upsert", {
	query: { name: "jake" },
	data: {
		name: "jake",
		age: 17
	}
}).on("end", function() {

	// update
	peopleDb("upsert", {
		query: { name: "jake" },
		data: {
			name: "jake",
			age: 18
		}
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

var peopleDb = mesh.top(mesh.child(db, { collection: "people" }));

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
