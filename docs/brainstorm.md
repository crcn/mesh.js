Crudlet is a universal, [streamable](https://nodejs.org/api/stream.html) interface for data stores that works on any platform. Basically that means that you
can use any database (or even your API) without it being coupled to your application. Crudlet also allows you to do some pretty fancy stuff too.

#### Why?

- Decoupled. Crudlet allows you to decouple any store (even your own API) from your front-end / backend application.
- Vendor lock-in. Using Crudlet means that you're not locked into any particular data store, e.g:  easily swap between realtime services like firebase, socket.io, parse, etc.
- Interoperable. Easily use your application code on multiple platforms (client & server-side). Just swap out the database adapter.
- Testable. Crudlet makes it super easy to stub-out any data store for testing purposes. Super useful especially for server-side apps (e.g: stubbing-out mongodb).
- Extensible. Easily add offline-mode & peer-to-peer (realtime) with just a few lines of code.
- Mashable. Mix & match data-stores to add additional functionality to your application.

#### Example

```javascript
var crud          = require("crudlet");
var pubnub        = require("crudlet-pubnub");
var localStorage  = require("crudlet-local-storage");

// store data locally on the users machine
var localdb = localStorage();

// pubnub adapter for sending operations to other connected clients
var pubdb   = pubnub({
  publishKey   : "publish key",
  subscribeKey : "subscribe key"
});

// the actual DB we're going to use. Pass
// all operations to localstorage, and pubnub
var db = crud.tailable(crud.parallel(localdb, pubdb));

// tail all operations send to pubnub back into the database. Note
// that remote calls won't get re-published to pubnub
pubdb("tail").pipe(crud.open(db));

// create a child database - collection will get passed to each operation
var peopleDb = crud.child(db, { collection: "people" });

// insert some people into the database
peopleDb("insert", {
  data: [
    { name: "Gordon Ramsay" },
    { name: "Ben Stiller"   }
  ]
});

// listen for ALL operations on the people collection
peopleDb("tail").on("data", function() {

});

```
