Questions:

- What?
  - reactive streaming data store library
  - more-so a fancy-ass event-bus system
    - but it's streamable
  - use as a data source abstraction layer
  - use as a realtime system
  - abstracts your service layer
- Why?
  - abstract service layer so that app is not coupled
  - more flexibil
  - enable applications to be run on dif
- use-cases
  - offline-mode.
  - initial data rendered by the server.
  - isomorphic front-ends. Faster initial load times.
  - realtime data
  - event bus system
  - rollback data
- What can it do?


ack
Pitches:


mesh is a streamable interface for synchronizing data sources. It allows you to easily implement advanced features
such as offline mode, realtime data, and other stuff with just a few lines of code.


mesh, is a common, streamable interface for sa. It allows you to easily implement advanced


mesh is a streamable interface for synchronizing data sources.

### Why?


mesh is a universal interface for communicating with data sources whether it's your API, mongodb, pubnub, webrtc, socket.io, redis, or local storage. Easily build sophisticated features such as offline-mode, realtime data, rollbacks, and more with little effort.

mesh is entirely customizable, and doesn't make assumptions about how a data source works. It's actually more-so a pattern that encourages you to interact with data a certain way, so you can easily build your own API adapter that's interoperable with all the other mesh plugins.

Here's a basic example of how you might implement an API that caches temporarily to local storage:

```javascript
var mesh         = require("mesh");
var http         = require("mesh-http");
var localStorage = require("mesh-local-storage");

// local storage cache - keep stuff for one minute max
var cache = localStorage({ ttl: 1000 * 60 });
var api   = http({ prefix: "/api" });

// pipe all persistence operations to the cache
api(mesh.op("tail")).pie(mesh.open(cache));

// the DB we'll use, return the first result returned, and
// only pass 'load' operations to the cache
var db    = mesh.first(mesh.accept("load", cache), api);


db(mesh.op("insert", {
  collection: "people"

  // path is automatically resolved from the collection param,
  // but you can easily override it.
  path: "/people",

  // POST is resolved from the operation name, but it's
  // also overrideabl
  method: "POST",

  data: { name: "john" }
})).on("data", function(personData) {

  // load the person saved. This should result in a cache
  // hit for local storage. Also note that the HTTP path & method
  // will automatically get resolved.
  db(mesh.op("load", {
    collection: "people",
    query: { name: person.name }
  })).
  on("data", function(personData) {
    // do stuff with data
  });
});
```
