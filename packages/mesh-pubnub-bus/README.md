
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
pubStream(mesh.action("anotherCommandToIgnore"));
```

#### db.addChannel(channel)

adds a new channel to subscribe to.

```javascript
pubStream.addChannel(mesh.action("someChannel"));
pubStream.addChannel(mesh.action("anotherChannel")_;
```

#### [stream.Readable](https://nodejs.org/api/stream.html#stream_class_stream_readable) db(actionName, options)

Publishes a new action to pubnub.

```javascript
pubStream({ name: "hello", data: { name: "world" }});
pubStream({ name "doSomething", data: { name: "world" }});
```

#### [stream.Readable](https://nodejs.org/api/stream.html#stream_class_stream_readable) db(tail, filter)

Tails a remote action. This is your subscription function.

```
db({ name: "tail" }).on("data", function(action) {

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

// listen for local actions on lokidb - pass to pubnub
db(mesh.action("tail")).pipe(mesh.open(pubdb));

// listen for remote actions on pubnub - pass to lokidb
pubdb(mesh.action("tail")).pipe(mesh.open(db));

// stored in loki & synchronized across clients
db(mesh.action("insert", { data: { name: "Juice" }}));
```
