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
var db = crudlet.tailable(crud.parallel(localdb, pubdb));

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
});


// listen for all operations on the people collection
peopleDb("tail", syncUI);
