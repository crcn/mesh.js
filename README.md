[![Build Status](https://travis-ci.org/mojo-js/mesh.js.svg)](https://travis-ci.org/mojo-js/mesh.js) [![Coverage Status](https://coveralls.io/repos/mojo-js/mesh.js/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/mesh.js?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/mesh.js.svg)](https://david-dm.org/mojo-js/mesh.js) [![Join the chat at https://gitter.im/mojo-js/mesh.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mojo-js/mesh.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**API Docs can be viewed [here](http://meshjs.herokuapp.com/docs)**

- npm installation: `npm install mesh`
- bower installation: `bower install mesh`

Mesh is a flexible data flow library that makes it incredibly easy to make data sources interoperable with one another. Easily connect things such as mongodb, pubnub, webrtc etc to build powerful features such as rollbacks, offline-mode, realtime data, and more.

Mesh is just a bundle of utility functions, and doesn't have much of an opinion about how you should use it. Do whatever you want!

Here's a basic example of how you might use Mesh with models:

```javascript
var mesh    = require("mesh");
var extend  = require("extend");
// var mongo   = require("mesh-mongodb");
// var memory  = require("mesh-memory");
var loki    = require("mesh-loki");

function UserModel(properties) {
  extend(this, properties);
}

extend(UserModel.prototype, {
  insert: function(onInsert) {
    this.bus({ name: "insert", data: this.toJSON() })
    .on("data", extend.bind(void 0, this))
    .on("end", onInsert || function() { });
  },
  toJSON: function() {
    return {
      _id          : this._id,
      name         : this.name,
      emailAddress : this.emailAddress
    }
  }
});

// var bus = memory();
var bus = loki();
// var bus = mongo({ host: "mongodb://127.0.0.1:27017/database" });

var user = new UserModel({
  name: "Mad Max",
  emailAddress: "mad@kindamad.com",
  bus: mesh.attach({ collection: "users" }, bus)
});

// insert user into mongodb, or any other database. The
// API is the same.
user.insert(function() {
  console.log(user);
});
```

#### Highlights

- Streamable interface.
- Works with any library, or framework.
- Works on any platform.
- Tiny (11kb).
- Works nicely with other stream-based libraries such as [highland](http://highlandjs.org/).
- Isomorphic. Easily use different data sources for different platforms.
- Easily testable. Stub out any data source for a fake one.
- Simple design. Use it for many other things such as an event bus, message-queue service, etc.
