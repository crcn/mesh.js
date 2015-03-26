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

var peopleCollection = db.child({ 
  collection: "people"
});

var Person = caplet.createModelClass({
  initialize: function() {
    this.setData = this.set.bind(this, "data");
    peopleCollection.tail({ "data.cid": this.cid }, this.setData);
  },
  save: function() {
    if(this.uid) {
      peopleCollection.update(this, { 
        route: "/people/" + this.uid
      }, ok(this.setData));

    } else {
      peopleCollection.create(this, { 
        route: "/people",
      }, ok(this.setData));
    }
  }
});

peopleCollection({ action: /create|remove/ }, function(op) {
  console.log(op.action);
  console.log(op.collection);
  console.log(op.data); 
});

var p = new Person();
p.set("name", "john"); // trigger watch 
```