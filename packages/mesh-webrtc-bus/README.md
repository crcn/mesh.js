```javascript
var mesh     = require("mesh");
var localStore  = require("mesh-local-storage");
var webrtc      = require("mesh-webrtc");

// get key here: http://peerjs.com/
var webRtcDb = webrtc({ key: "peer-id" });
var db = mesh.parallel(localStore(), webRtcDb);

webRtcDb.peer.connect("peerId");

mesh.run(db, "tail").on("data", function(operation) {

});

mesh.stream(db).write(mesh.operation("insert", {data: "blarg" }));
```
