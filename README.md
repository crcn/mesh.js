```javascript
var caplet  = require("caplet");
var crudlet = require("crudlet");
var localdb = require("crudlet-localdb");
var http    = require("crudlet-http");
var pubnub  = require("crudlet-pubnub");
var xtend   = require("xtend/mutable");
var ok      = require("okay");


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
    this.setData = this.set.bind(this, "data");
    peopleCollection.run("tail", { { query: { "data.cid": this.cid }}}, this.setData);
    this.watch(function() {
      peopleCollection.run("sync", { data: this.toJSON() });
    });
  },
  save: function() {
    if(this.uid) {
      peopleCollection.update({ 
        data: this.toJSON(),
        route: "/people/" + this.uid
      }, ok(this.setData));

    } else {
      peopleCollection.create({ 
        data: this.toJSON()
        route: "/people",
      }, ok(this.setData));
    }
  },
  load: function() {
    peopleCollection.load({
      data: this.toJSON()
    }, ok(this.setData));
  }
});

peopleCollection.run("tail", { action: /create|remove/ }, function(op) {
  console.log(op.action);
  console.log(op.collection);
  console.log(op.data); 
});

var p = new Person();
p.set("name", "john"); // trigger watch 
```