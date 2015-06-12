[![Build Status](https://travis-ci.org/mojo-js/mesh.js.svg)](https://travis-ci.org/mojo-js/mesh.js) [![Coverage Status](https://coveralls.io/repos/mojo-js/mesh.js/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/mesh.js?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/mesh.js.svg)](https://david-dm.org/mojo-js/mesh.js) [![Join the chat at https://gitter.im/mojo-js/mesh.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mojo-js/mesh.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**API Docs can be viewed [here](http://meshjs.herokuapp.com/docs)**

- npm installation: `npm install mesh`
- bower installation: `bower install mesh`

Mesh is a flexible data flow library that makes it incredibly easy to make data sources interoperable with one another. Easily connect things such as [mongodb](http://pubnub.com/), [pubnub](http://pubnub.com/), `webrtc` etc to build powerful features such as rollbacks, offline-mode, realtime data, and more.

Mesh is just a bundle of utility functions, and doesn't have much of an opinion about how you should use it.

Simple realtime example:

```javascript
var mesh         = require("mesh");
var localStorage = require("mesh-local-storage");
var io           = require("mesh-socket.io");

var bus = localStorage();
bus     = mesh.tailable(bus);

// persist all operations to socket.io & any operations from socket.io
// back to the local bus. (Note that remote operations will get ignored)
bus({ name: "tail" }).pipe(mesh.open(io({ channel: "operations" }, bus)));

// insert data. Persists to local storage, and gets
// broadcasted to all connected clients.
bus({
  name : "insert",
  collection : "messages"
  data : { text: "hello world" }
});
```

#### Resources

- [Plugins](https://www.npmjs.com/search?q=meshjs)
- [Documentation](http://meshjs.herokuapp.com/docs)
- [Examples](https://github.com/mojo-js/mesh.js/tree/master/examples)

#### Highlights

- Streamable interface.
- Works with any library, or framework.
- Works on any platform.
- Tiny (11kb).
- Works nicely with other stream-based libraries such as [highland](http://highlandjs.org/).
- Isomorphic. Easily use different data sources for different platforms.
- Easily testable. Stub out any data source for a fake one.
- Simple design. Use it for many other things such as an event bus, message-queue service, etc.
