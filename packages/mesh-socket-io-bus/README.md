
[![Build Status](https://travis-ci.org/mojo-js/mesh-socket.io.svg)](https://travis-ci.org/mojo-js/mesh-socket.io) [![Coverage Status](https://coveralls.io/repos/mojo-js/mesh-socket.io/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/mesh-socket.io?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/mesh-socket.io.svg)](https://david-dm.org/mojo-js/mesh-socket.io)

Streams for [socket.io](http://socket.io/). Also works with [mesh](https://github.com/mojo-js/mesh.js).

#### Basic example

```javascript
var mesh = require("mesh");
var loki = require("mesh-loki");
var io   = require("mesh-socket.io");

var bus = mesh.tailable(loki());

// setup socket io - take all remote ops and pass
// to the bus
var iobus = mesh.reject("load", io({
  host: "http://localhost"
}, bus));

// pipe all operations on bus to socket.io
bus(mesh.op("tail")).pipe(mesh.open(iobus));

// insert data into the DB. Should get broadcasted
// to socket.io
bus(mesh.op("insert", {
  collection: "people"
  data: {
    name: "Shrek"
  }
}));
```

#### server configuration

Server configuration is pretty easy to setup. Just re-broadcast incomming operations.

```javascript
var io = require("socket.io");
var server = io(80);
server.on("connection", function(connection) {

  // note that "operation" is the channel that the client is
  // publishing / subscribing to
  connection.on("operation", function(operation) {

    // re-broadcast to other clients
    connection.broadcast.emit("operation", operation);
  });
});
```

#### db(options, bus)

creates a new socket.io streamer.

- `options`
  - `host` - socket.io server host
  - `channel` - channel to subscribe to. Default is `operation`.
- `bus` - bus to pass remote calls to

```javascript
var iodb = io({
  host: "http://localhost",
  channel: "myOperationsChannel"
})
```

#### [stream.Readable](https://nodejs.org/api/stream.html#stream_class_stream_readable) db(operationName, options)

Broadcasts a new operation. This can be anything.

#### [stream.Readable](https://nodejs.org/api/stream.html#stream_class_stream_readable) db(tail, filter)

Tails a remote operation.

```javascript

// tail all operations
db(mesh.op("tail")).on("data", function() {

});

// tail only insert operations
db(mesh.op("tail", { name: "insert" })).on("data", function() {

});

// tail only operations on people collection
db(mesh.op("tail", { collection: "people" })).on("data", function() {

});
```
