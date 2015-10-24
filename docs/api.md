### Bus API

The `Bus` is your operation handler. They're designed to building blocks that enable you to mix & match them however you want.

#### creating a bus

Busses are composed of two parts: an `execute` method which handles operations, and a [response](#Response) which is returned by the execute method. You can use whatever method you want so long as you stick to those core patterns.

There are a number of ways to create a bus. Probably the easiest method is to extend the base class. Here's a simple example:

```javascript
var mesh = require("mesh");
var Bus = mesh.Bus;
var BufferedResponse = mesh.BufferedResponse;

// extend the base class. Base is a class, so if you're using
var HelloBus = Bus.extend({
  execute: function(operation) {
    return BufferedResponse.create(void 0, "hello " + operation.name + "!");
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

You can also go the more functional route like so:

```javascript
var EmptyResponse = require("mesh").EmptyResponse;

function createBus(options) {
  return {
    execute: function(operation) {
      // do something with operation here
      return EmptyResponse.create();
    }
  };
}

var bus = createBus(options);
bus.execute().then(function() {
  // operation completed
});
```


#### WrapBus(executeFunction)

Wraps `executeFunction` as a bus. This class is useful if you're looking to incorporate other libraries with Mesh. Here are a few examples of how you can use this class:


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

// support for node style callbacks
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

Executes an operation against multiple busses at the same time. Chunk data emitted by each bus is then merged into a single response in an un-ordered fashion.

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

pingResponse.readAll().then(function(err, pongs) {
  //
});
```

#### SequenceBus([busses])

Executes operations against a each bus one at a time. Data is merged into one stream according to the order of each bus.

```javascript
var bus = SequenceBus.create([
  BufferedBus.create(void 0, "a"),
  BufferedBus.create(void 0, "b"),
  BufferedBus.create(void 0, "c")
]);

bus.execute().read(function(chunks) {
  console.log(chunks); // [a, b, c]
});
```


#### FallbackBus([busses])

Executes one operation against all busses sequentially until one bus emits data.

```javascript
var bus = FallbackBus([
  APIBus.create("https://sever1.com"),
  APIBus.create("https://sever2.com")
]);
```

#### RaceBus([busses])

Executes one operation against all busses in parallel until one bus emits data. The response data from the fastest bus is returned.

#### RetryBus(count, bus)

Re-executes an operation if it fails against `bus` until `count` is 0.

#### CatchBus(bus, catchErrorFunction)

Catches an error emitted by `bus`.

#### NoopBus()

No-operation bus.

```javascript
var bus = NoopBus.create();

// does nothing
bus.execute().then(function() {

});
```

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
