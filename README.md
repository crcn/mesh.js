Example:

```javascript
var crudlet = require("crudlet");
var localdb = require("crudlet-localdb");
var http    = require("crudlet-http");
var webrtc  = require("crudlet-webrtc");


var db = crudlet.parallel(localdb(), http(), webrtc());

var peopleDb = db.child(db, {
  collection: "people",
  http: {
    get: "/people",
    post: "/people",
    put: "/people/:data.uid",
    del: "/people/:data.uid"
  }
});

// tail remote operations (webrtc)
peopleDb.on("data", function(operation) {

}).write(crudlet.operation("tail", { remote: true }));

// write to localdb, http, and webrtc
peopleDb.write(crudet.operation("insert", { data: { name: "blarg" }}));
```
