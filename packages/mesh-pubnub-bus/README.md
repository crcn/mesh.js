
[![Build Status](https://travis-ci.org/mojo-js/mesh-pubnub.svg)](https://travis-ci.org/mojo-js/mesh-pubnub) [![Coverage Status](https://coveralls.io/repos/mojo-js/mesh-pubnub/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/mesh-pubnub?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/mesh-pubnub.svg)](https://david-dm.org/mojo-js/mesh-pubnub)

A streamable interface for [Pubnub](http://www.pubnub.com/). This library also works nicely with [mesh](https://github.com/mojo-js/mesh.js), and other mesh adapters.

#### Example

```javascript
var pubnub      = require("mesh-pubnub");
var memory      = require("mesh-memory");
var mesh        = require("mesh");

var mem = mesh.tailable(memory());

var pubnub = mesh.reject("load", pubnub({
  subscribeKey: "sub key"
  publishKey: "pub key",
  channel: "streamChannel"
}, mem);


mem(mesh.op("tail")).pipe(mesh.open(pubnub));
```


#### db pubnub(options, responseBus)

Creates a new pubnub streamer.

- `options`
  - `subscribeKey` - your pubnub subscription key
  - `publishKey` - your pubnub publish key
  - `channel` - (optional) the channel to subscribe to
- `responseBus` - set of commands to reject - default is `[load]`

```javascript
var pubStream = pubnub({
  subscribeKey: "sub key"
  publishKey: "pub key",
  channel: "streamChannel"
}, memoryBus);

// does not get broadcasted
pubStream(mesh.operation("anotherCommandToIgnore"));
```

#### db.addChannel(channel)

adds a new channel to subscribe to.

```javascript
pubStream.addChannel(mesh.operation("someChannel"));
pubStream.addChannel(mesh.operation("anotherChannel")_;
```

#### [stream.Readable](https://nodejs.org/api/stream.html#stream_class_stream_readable) db(operationName, options)

Publishes a new operation to pubnub.

```javascript
pubStream({ name: "hello", data: { name: "world" }});
pubStream({ name "doSomething", data: { name: "world" }});
```

#### [stream.Readable](https://nodejs.org/api/stream.html#stream_class_stream_readable) db(tail, filter)

Tails a remote operation. This is your subscription function.

```
db({ name: "tail" }).on("data", function(operation) {

});

```

Or you can do something like synchronizing databases between clients:

```javascript
var mesh   = require("mesh");
var loki   = require("mesh-loki");
var pubnub = require("mesh-pubnub");

var pubdb = pubnub({
  subscribeKey: "sub key"
  publishKey: "pub key",
  channel: "streamChannel"
});

var db = mesh.tailable(loki());

// listen for local operations on lokidb - pass to pubnub
db(mesh.operation("tail")).pipe(mesh.open(pubdb));

// listen for remote operations on pubnub - pass to lokidb
pubdb(mesh.operation("tail")).pipe(mesh.open(db));

// stored in loki & synchronized across clients
db(mesh.operation("insert", { data: { name: "Juice" }}));
```
