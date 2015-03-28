```javascript
var caplet  = require("caplet");
var crudlet = require("crudlet");
var localdb = require("crudlet-localdb");
var http    = require("crudlet-http");
var pubnub  = require("crudlet-pubnub");
var xtend   = require("xtend/mutable");


var db = crudlet(
  crudlet.sequence(
    crudlet.parallel(
      localdb(),
      http()
    ),
    pubnub()
  )
);

var peopleCollection = db.child({
  collection: "people"
});

var Person = caplet.createModelClass({
  initialize: function() {
    this.opStream = db();
    this.opStream.pipe(crudlet.delta()).on("data", this.set.bind(this, "data"));
  },
  save: function() {
    if(this.uid) {
      this.opStream.write(crudlet.operation("update", {
        data: this,
        route: "/people/" + this.uid
      }));
    } else {
      this.opStream.write(crudlet.operation("insert", {
        data: this,
        route: "/people"
      }));
    }
  },
  load: function() {
    this.opStream.write(crudlet.operation("load", {
      data: this
    }));
  }
});

db("tail").pipe(crudlet.filter({ name: /create|remove/ })).on("data", function(operation) {
  console.log(operation.name);
  console.log(operation.collection);
  console.log(operation.data);
});

var p = new Person();
p.set("name", "john"); // trigger watch
```
