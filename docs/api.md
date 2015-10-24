### Bus API

The `Bus` handles operations, and also routes them according to whatever rules you specify. The `Bus` embodies the decorator pattern - you can easily mix & match whatever you want to solve sophisticated data flows.

#### creating a bus

There are a number of ways to create a bus. Probably the easiest method is to extend bus base class. Here's a simple example:

```javascript
var mesh = require("mesh");
var Bus = mesh.Bus;
var BufferedResponse = mesh.BufferedResponse;

// extend the base class. Base is a class, so if you're using
var HelloBus = Bus.extend({
  execute: function(operation) {
    return new BufferedResponse(void 0, "hello " + operation.name + "!");
  }
});

// you can also call new HelloBus.
var bus = HelloBus.create();

// execute an operation
var response = bus.execute({
  name: "John"
});

// read one chunk
response.read().then(function(value) {
  console.log(value); // hello John!
});
```


#### WrapBus(executeFunction)

Wraps `executeFunction` as a bus. Here's an example of all the variations you can use with the WrapBus class.

Simple example:

```javascript
import { WrapBus } from "mesh";
import fs from "fs";

// simple bus out of an object
var readFileBus = WrapBus.create(function(operation) {
  return NodeStreamResponse.create(fs.readFile(operation.name));
});

// support for es7 await
var bus = WrapBus.create(async function(operation) {
  var buffer = [];
  var value;
  var done;

  
  var response = readFileBus.execute({ path: operation.path });

  while(({value, done} = await response.read()) && !done) {
    buffer.push(value);
  }

  return buffer;
});

// suprt for node style callbacks
var bus = WrapBus.create(function(operation, complete) {
  complete(void 0, "chunk"); // complete with data
  // complete(new Error("an error")); 1st param reserved for errors
});

// support for synchronous handlers
var bus = WrapBus.create(function(operation) {
  // throw new Error("an error");
  return "chunk"; // resolve data
});

// support for promises
var bus = WrapBus.create(function(operation) {
  return new Promise(function(resolve, reject) {
    resolve("chunk");
  });
});

var response = bus.execute({
  action: "doSomething"
});

response.read().then(function(chunk) {
  // do something with chunk
});
```

#### ParallelBus([busses])

Executes operations in parallel against `[busses]`, and merges all `chunks` from `[busses]` into one response in an un-ordered fashion.

```javascript
import { ParallelBus } from "mesh";

var allWorkersBus = ParallelBus.create([
  WorkerBus.create({ script: __dirname + "/worker.js" }),
  WorkerBus.create({ script: __dirname + "/worker.js" })
]);

// ping all workers
var pingResponse = allWorkersBus.execute({
  action: "ping"
});

var value;
var done;

while(({ value, done } = await pingResponse.read()) && !done) {
  console.log(value); // response from workers
}
```

#### SequenceBus([busses])

Executes operations against all `[busses]` sequentially. All `chunks` are merged into the returned streamed.

<!-- TODO - different example here -->
```javascript
var allWorkersBus = SequenceBus.create([
  WorkerBus.create({ script: __dirname + "/worker.js" }),
  WorkerBus.create({ script: __dirname + "/worker.js" })
]);

// restart all workers sequentially
allWorkersBus.execute({
  action: "restart"
});
```

#### FallbackBus([busses])

Executes an operation against `[busses]` sequentially until *one* of them returns a chunk.

#### RaceBus([busses])

Executes an operation against `[busses]` in parallel until *one* emits a chunk.

#### RetryBus(count, bus)

Re-executes an operation if it fails against `bus` until `count` is 0.

#### CatchBus(bus, catchErrorFunction)

Catches an error emitted by `bus`.

#### NoopBus()

No-operation bus.

#### AcceptBus(filter, resolveBus[, rejectBus])

passes operations to `resolveBus` if `filter` returns true against the executed operation. Otherwise the operation gets sent to `rejectBus`.

```javascript
var bus = AcceptBus.create(function(operation) {
  return operation.name = "ping";
}, WrapBus.create(function() {
  return "pong!";
}))

bus.execute({ name: "ping" }) // pong!
bus.execute({ name: "pong" }) // nothing happens. This is a no-op.
```

#### RejectBus(filter, resolveBus[, rejectBus])

Similar to accept bus

#### MapBus(bus, mapFunction)

Maps the response chunks from `bus`.

```javascript
var bus = WrapBus.create(function(operation) {
  return operation.echo;
});
bus = MapBus.create(bus, function(chunkValue, writable, operation) {
  chunkValue.split("").forEach(writable.write.bind(writable));
});

bus.execute({ echo: "hello" }); // ["h", "e", "l", "l", "o"]
```

#### BufferedBus(error, [chunkValues])

Returns data specified in the constructor. Useful for testing.

```javascript

import expect from "expect.js";
import { BufferedBus } from "mesh";

// simple example of how you can use Mesh with models
class PersonModel {
  save() {
    return this._id ? this.insert() : this.update();
  }
  insert() {
    return this._run("insert", {
      data: this
    });
  }
  update() {
    return this._run("update", {
      data  : this,
      query : { _id: this._id }
    });
  }
  load() {
    return this._run("load", {
      query: { _id: this._id }
    });
  }
  remove() {
    return this._run("remove", {
      query: { _id: this._id }
    });
  }
  async _run(action, ops) {

    // execute the operation
    var response = this.bus.execute(Object.assign({
      action     : action
    }, ops));

    // read one chunk
    var {value} = await response.read();

    // if there *is* a value, then set the properties onto this model
    if (value) {
      Object.assign(this, value);
    }

    // return the response so that it can be awaited
    return response;
  }
}

/*
import MongoDbBus from "mesh-mongo-db-bus";
var bus = new MongoDbBus();
var person = new PersonModel({
  bus: new AttachDefaultsBus({ collection: "people" }, bus),
  name: "jeff"
});

await person.save(); // insert into mongodb
*/

it("can load data into the model", async function() {
  var person = PersonModel.create({
    bus: BufferedBus.create(void 0, { name: "Mclaren Eff One" })
  });

  await person.load();

  expect(person.name).to.be("Mclaren Eff One");
});
```

#### AttachDefaultsBus(operationDefaults, bus)

Attaches default properties onto executed operations.

```javascript
import { AttachDefaultsBus, WrapBus } from "mesh";
import SocketIoBus from "mesh-socket-io-bus";

var bus = WrapBus.create(function(operation) {
  console.log(operation.remote); // true
});

// each operation pushed from socket.io will be tagged as remote here
bus = SocketIoBus.create({
  host: "//127.0.0.1:8080"
}, AttachDefaultsBus.create({ remote: true }, bus));
```

## Response API

#### Response(runFunction)

Returns an async response

```javascript
import { WrapBus, Response } from "mesh";

var bus = WrapBus.create(function(operation) {
  return Response.create(function(writable) {
    writable.write("chunk");
    writable.write("chunk");
    writable.end();
  });
})
```

#### BufferedResponse(error, [chunkValues])

Returns a buffered response

#### EmptyResponse()

Returns an empty response

#### NodeStreamResponse(stream)

Wraps a node stream in a `Response` object. See example above.

#### ErrorResponse(error)

Returns an error response

```javascript
var bus = WrapBus.create(function(operation) {
  return ErrorResponse.create(new Error("an error"));
});

bus.execute().read().catch(function(error) {
  console.log(error); // an error
});
```

## Stream API
