Streamable database adapter for [LokiJS](http://lokijs.org/#/), an in-memory JavaScript database. Operation docs on this library can be viewed here: http://meshjs.herokuapp.com/docs/database-adapters.

```javascript
var mesh   = require("mesh");
var lokidb = require("crudlet-loki");
var loki   = require("loki");
var _      = require("highland");

// setup the DB
var db = lokidb(new loki(__dirname + "/db.json"));
// db = lokidb(__dirname + "/db.json"); // also works

// setup the child collection
var peopleDb = crud.child(db, { collection: "people" });

// insert one, or many items
peopleDb("insert", {
  data: [
    { name: "Sleipnir"    , legs: 8 },
    { name: "Jormungandr" , legs: 0 },
    { name: "Hel"         , legs: 2 }
  ]
).

// collect all the inserted items & put them in an array using HighlandJS
// this is similar to something like cursor.toArray() in mongodb
pipe(_pipeline(_.collect())).

// wait for the data to be emitted
on("data", function(people) {

  // load all people who have more than 0 legs
  peopleDb("load", {
    multi: true,
    query: {
      legs: { $gt: 0 }
    }
  }).
  pipe(_().collect()).
  on("data", function(people) {
      // do stuff with loaded people
  });

});
```

#### db lokidb(targetOrOptions)

Creates a new crudlet-based db

- `targetOrOptions` - the target loki DB or the options for a new loki db

```javascript
var db = lokidb(__dirname + "/db.json");
var db = lokidb(new loki(__dirname + "/db.json"));
```
