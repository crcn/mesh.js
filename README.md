```javascript
var caplet  = require("caplet");
var crudlet = require("crudlet");
var localdb = require("crudlet-localdb");
var http    = require("crudlet-http");
var pubnub  = require("crudlet-pubnub");
var xtend   = require("xtend/mutable");
var ok      = require("okay");

var db = crudlet(
  pubnub(),
  localdb(),
  http()
);

var Person = caplet.createModelClass({
  initialize: function() {
    db.tail(this, { collection: "people" }); // listen for any changes
  },
  save: function() {
    if(this.uid) {
      db.update(this, { 
        collection: "people",
        route: "/people/" + this.uid
      }, ok(this.set.bind(this, "data")));

    } else {
      db.create(this, { 
        collection: "people",
        route: "/people",
      }, ok(this.set.bind(this, "data")));
    }
  }
});

db.collection("people").watch(function() {
  
});

var p = new Person();
p.set("name", "john"); // trigger watch 
```