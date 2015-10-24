### Bus API

The `Bus` routes requests to one or many subscribers according to a set of rules. It Also returns one single or merged response immediately upon execution.

Below are a set of built-in utilities you can use to route requests.

#### Bus()

This is the base class for all built-in bus

es6-style:

```javascript
import { Bus, NodeStreamResponse } from "mesh";

class ReadFileBus extends Bus {
  execute(request) {

    // handle the request, and
    return NodeStreamResponse.create(fs.createReadStream(request.path));
  }
}

var bus = ReadFileBus.create();

var response = bus.execute({ path: __filename });

response.read().then(function(chunk) {
  // do something with chunk.value
});
```

or es5-style:

```javascript
function MyBus() {
  Bus.call(this);
}

Bus.extend(MyBus, {
  // props
});
```

#### WrapBus(executeFunction)

Wraps `executeFunction` as a bus.

Simple example:

```javascript
import { WrapBus } from "mesh";

var readFileBus = ReadFileBus.create();

// support for es7 await
var bus = WrapBus.create(async function(request) {
  var buffer = [];
  var value;
  var done;
  var response = readFileBus.execute({ path: request.path });

  while(({value, done} = await response.read()) && !done) {
    buffer.push(value);
  }

  return buffer;
});

// suprt for node style callbacks
var bus = WrapBus.create(function(request, complete) {
  complete(void 0, "chunk"); // complete with data
  // complete(new Error("an error")); 1st param reserved for errors
});

// support for synchronous handlers
var bus = WrapBus.create(function(request) {
  // throw new Error("an error");
  return "chunk"; // resolve data
});

// support for promises
var bus = WrapBus.create(function(request) {
  return new Promise(function(resolve, reject) {
    resolve("chunk");
  });
});

var response = bus.execute({
  action: "doSomething"
});

response.read().then(function(chunk) {

});
```

#### ParallelBus([busses])

Executes requests in parallel against `[busses]`, and merges all `chunks` from `[busses]` into one response in an un-ordered fashion.

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

Executes requests against all `[busses]` sequentially. All `chunks` are merged into the returned streamed.

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

Executes an request against `[busses]` sequentially until *one* of them returns a chunk.

#### RaceBus([busses])

Executes an request against `[busses]` in parallel until *one* emits a chunk.

#### RetryBus(count, bus)

Re-executes an request if it fails against `bus` until `count` is 0.

#### CatchBus(bus, catchErrorFunction)

Catches an error emitted by `bus`.

#### NoopBus()

No-request bus.

#### AcceptBus(filter, resolveBus[, rejectBus])

passes requests to `resolveBus` if `filter` returns true against the executed request. Otherwise the request gets sent to `rejectBus`.

```javascript
var bus = AcceptBus.create(function(request) {
  return request.name = "ping";
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
var bus = WrapBus.create(function(request) {
  return request.echo;
});
bus = MapBus.create(bus, function(chunkValue, writable, request) {
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

    // execute the request
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

#### AttachDefaultsBus(requestDefaults, bus)

Attaches default properties onto executed requests.

```javascript
import { AttachDefaultsBus, WrapBus } from "mesh";
import SocketIoBus from "mesh-socket-io-bus";

var bus = WrapBus.create(function(request) {
  console.log(request.remote); // true
});

// each request pushed from socket.io will be tagged as remote here
bus = SocketIoBus.create({
  host: "//127.0.0.1:8080"
}, AttachDefaultsBus.create({ remote: true }, bus));
```

## Response API

#### Response(runFunction)

Returns an async response

```javascript
import { WrapBus, Response } from "mesh";

var bus = WrapBus.create(function(request) {
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
var bus = WrapBus.create(function(request) {
  return ErrorResponse.create(new Error("an error"));
});

bus.execute().read().catch(function(error) {
  console.log(error); // an error
});
```

## Stream API
