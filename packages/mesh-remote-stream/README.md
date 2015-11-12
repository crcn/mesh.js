basic RPC system for mesh. Allows you to execute remote operations, and receive responses.

Bus example:

```javascript
var ros    = require("ros");
var mesh   = require("mesh");
var io     = require("socket.io");
var memory = require("mesh-memory");



function realtime(options, appBus) {
  var client = io(options);
  return ros(client.on.bind(client, "message"), client.emit.bind("message"), appBus);
}

// local
var bus = realtime("http://localhost:8080");

bus(mesh.op("load")).on("data", function() {

});

```
