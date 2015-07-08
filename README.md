[![Build Status](https://travis-ci.org/mojo-js/mesh.js.svg)](https://travis-ci.org/mojo-js/mesh.js) [![Coverage Status](https://coveralls.io/repos/mojo-js/mesh.js/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/mesh.js?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/mesh.js.svg)](https://david-dm.org/mojo-js/mesh.js) [![Join the chat at https://gitter.im/mojo-js/mesh.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mojo-js/mesh.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**API Docs can be viewed [here](http://mesh.mojojs.com/docs)**


Mesh is a flexible data synchronization library that makes it incredibly easy to make data sources interoperable with one another. Easily connect things such as [mongodb](https://www.mongodb.org/), [pubnub](http://pubnub.com/), [socket.io](http://socket.io/) `webrtc` etc to build powerful features such as rollbacks, offline-mode, realtime data, and more.

Mesh is just a bundle of utility functions, and doesn't have much of an opinion about how you should use it.

Simple realtime example:

```javascript
var mesh    = require("mesh");
var storage = require("mesh-local-storage");

// use any one of these database adapters. They all handle
// the same CRUD operations
// var storage = require("mesh-memory");
// var storage = require("mesh-loki");
var realtime  = require("mesh-socket.io");

var storageBus = storage();

// persist all operations to socket.io & any operations from socket.io
// back to local storage.
var mergedBus = mesh.parallel(
  storageBus,
  realtime({ channel: "operations" }, storageBus)
);

// insert data. Persists to local storage, and gets
// broadcasted to all connected clients.
mergedBus({
  name : "insert",
  collection : "messages"
  data : { text: "hello world" }
});
```

#### Highlights

- [Streamable](https://github.com/substack/stream-handbook) interface.
- Utility based. Kinda like underscore for data.
- Works with any library, or framework (React, express).
- Works on any JavaScript platform (browser, NodeJS).
- Tiny (11kb).
- Works nicely with other stream-based libraries such as [highland](http://highlandjs.org/).
- Isomorphic. Easily use different data sources for different platforms.
- Highly testable. Stub out any data source for a fake one.
- Simple design. Use it for many other things such as an event bus, message-queue service, etc.

#### Installation

[NPM](https://www.npmjs.com/): `npm install mesh` <br />
[Bower](http://bower.io/): `bower install mesh`

## Resources

- [Examples](./examples)
  - [API Example](./examples/api) - example demonstrating how mesh can be used with APIs.
  - [Distributed Network](./examples/distributed-network) - demo of how mesh can be used to build a distributed network.
  - [React](./examples/react) - simple ReactJS example.
  - [Database Adapter](./examples/database-adapter) - in-memory database adapter example.
- Discuss
  - [Google group](https://groups.google.com/forum/#!forum/meshjs)
  - [Gitter chat](https://gitter.im/mojo-js/mesh.js)
- Documentation
  - [Core API](http://mesh.mojojs.com/docs)
  - [Load balancing API](http://mesh.mojojs.com/docs/balance)
  - [Writing adapters](http://mesh.mojojs.com/docs/database-adapters)
- [Plugins](https://www.npmjs.com/search?q=meshjs)
  - [load balancing algorithms](https://github.com/mojo-js/mesh-balance)
  - [local storage](https://github.com/mojo-js/mesh-local-storage)
  - [pubnub](https://github.com/mojo-js/mesh-pubnub)
  - [webrtc](https://github.com/mojo-js/mesh-webrtc)
  - [mongodb](https://github.com/mojo-js/mesh-mongodb)
  - [memory database](https://github.com/mojo-js/mesh-memory)
  - [loki](https://github.com/mojo-js/mesh-loki)
  - [socket.io](https://github.com/mojo-js/mesh-loki)
- [Extra utilities](./extra)
  - [cache](./extra/cache) - caches operations results. Sorta like memoization.
  - [commands](./extra/commands) - easily register operation handlers by name
  - [join](./extra/join) - join other operations into one stream according to emitted data (like DB joins).
- Articles
  - [Why re-write code when you can strangle it?](http://blog.hellosign.com/why-rewrite-your-code-when-you-can-strangle-it/)

<!--
- Other useful resources
  - [transducers (closure)](http://clojure.org/transducers)
  - [transducers (javascript)](http://jlongster.com/Transducers.js--A-JavaScript-Library-for-Transformation-of-Data)
  - [currying in JavaScript](https://medium.com/@kbrainwave/currying-in-javascript-ce6da2d324fe)
-->

## Licence (MIT)

Copyright (c) 2015 [Craig Condon](http://craigjefferds.com)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
