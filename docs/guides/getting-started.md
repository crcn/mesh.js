The easiest way to get started with Mesh is to download the [NPM](http://npmjs.org) or [bower](http://bower.io/) packages. Here are the commands you can use to do that:

```
npm install mesh --save
npm install bower
```

After that you can start using the library.

#### How to use Mesh

Mesh can be thought of a publish/subscribe library - operations get published to a bus, when then get passed to a subscriber. The subscriber then returns a streamable response to the publisher. Here's an example:

```javascript
var EmptyResponse = require("mesh").EmptyResponse;

var helloBus = {
  execute: function() {
    console.log("hello world!");
    return EmptyResponse.create();
  }
};

helloBus.execute(); // logs hello world!
```

The response can also stream back chunks of data. For example:

```javascript
var fs = require("fs");
var NodeStreamResponse = require("mesh").NodeStreamResponse;
var readFileBus = {
  execute: function(operation) {
    return NodeStreamResponse.create(fs.createReadStream(operation.path));
  }
};

var response = readFileBus.execute({ path: __filename });

response.read().then(function(chunk) {
  console.log(chunk.value);
})
```

The `read` method reads *one* chunk emitted by the response. If you want to read all of the chunks, you can simple call `response.read()` until `chunk.done` is true. Like so:

```javascript
var buffer = [];
function readAll(response, done) {
  response.read().then(function(chunk) {
    if (chunk.done) return done(void 0, buffer);
    pump(response, done);
  })
}

readAll(readFileBus.execute({ path: __filename }), function(err, buffer) {
  //
});
```

You can also simply call the `readAll()` property on the response:

```javascript
readFileBus.execute({ path: __filename }).readAll().then(function(buffer) {
  //
});
```

<!-- more info on busses -->

#### Organization

This is just my preference, but I typically only have **one** main bus which is used throughout the application. This bus handles all operations executed by other parts of the application. Here's how I typically organize my bus code:

```
src/ - application source
  bus/ - ALL bus code
    index.js - the file which ties everything together
    commands/ - application commands
      index.js
      users.js - user specific commands such as signup, resetPassword, etc
      ...
    database/ - bus database adapters
      mock.js - mock database adapter than can be swapped in for testing
      mongo.js - database adapter used for production
    realtime/ - realtime bus adapters
      socket-io.js
  models/ - model code
    user.js
    organization.js
  components/
    main/
      index.jsx
      pages/
        auth/
          signup.jsx
          forgot-password.jsx
```

The additional folders above: `models`, and `components` are included to demonstrate how `bus` fits into a front-end application as a whole. Note that the folder structure above can also be adapted to APIs.

#### Implementation

The main bus should tie everything together. Here's what `bus/index.js` might look like based on the folder structure above:

```javascript
import { * as CommandsBus } from "./commands";
import { * as DatabaseBus } from "./database";

export function create(options) {

  // create the database bus with the options
  var bus = DatabaseBus.create(options);

  // commands are interface the database. Database should never by exposed directly
  bus = CommandsBus.create(options, bus);
  return bus;
}
```

`database/index.js` bus:

```javascript
import MongoDbBus from "./mongo";
import MockDbBus  from "./mock";

var dbBusClasses = {
  mongo: MongoDbBus,
  mock: MockDbBus
};

export function create(options) {
  var dbBusClass = dbBusClasses[options.db.type];
  return dbBusClass.create(options);
}
```

`commands/index.js` bus:

```javascript
import { create as createUserCommands } from "./users";
import { create as createOrganizationCommands } from "./organization";
import { NoopBus } from "mesh";

export function create(options, internalBus) {

  var allCommands = Object.assign(
    {
      noop: NoopBus.create()
    },
    createUserCommands(options, internalBus),
    createOrganizationCommands(options, internalBus)
  );

  return {
    execute: function(operation) {
      var commandBus = (allCommands[operation.action] || allCommands.noop);
      return commandBus.execute(operation);
    }
  }
}
```

`commands/users.js`:

```javascript
import { WrapBus, EmptyResponse } from "mesh";
import User from "models/user";
import httperr from "httperr";

export function create(options) {
  return {
    resetPassword: WrapBus.create(async function(operation) {
      var user;

      if (!(user = await User.findOne(operation.query.user))) {
        throw new httperr.NotFound("user not found");
      }

      // impl reset password code here
    })
  };
}
```
