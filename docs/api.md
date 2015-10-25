### Bus API

The `Bus` is your operation handler. Busses are designed to be building blocks, so mix & match them however you want.

#### creating a bus

Busses are composed of two parts: an `execute` method which handles operations, and a [response](#Response) which is returned by the execute method. You write busses however you want so long as you stick to those core patterns.

There are a number of ways to create a bus. Probably the easiest way is to extend the base class. Here's a simple example:

```javascript
var mesh = require('mesh');
var Bus = mesh.Bus;
var BufferedResponse = mesh.BufferedResponse;

// extend the base class. Base is a class, so if you're using
var HelloBus = Bus.extend({
  execute: function(operation) {
    return BufferedResponse.create(void 0, 'hello ' + operation.name + '!');
  }
});

// you can also call new HelloBus.
var bus = HelloBus.create();

// execute an operation
var response = bus.execute({
  name: 'John'
});

// read one chunk
response.read().then(function(value) {
  console.log(value); // hello John!
});
```

You can also go the more functional route like so:

```javascript
var EmptyResponse = require('mesh').EmptyResponse;

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

Wraps `executeFunction` as a bus. This class is useful if you're looking to incorporate other libraries into Mesh. Here are a few examples of how you can use this class:


```javascript
import { WrapBus } from 'mesh';
import fs from 'fs';

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
  complete(void 0, 'chunk'); // complete with data
  // complete(new Error('an error')); 1st param reserved for errors
});

// support for synchronous handlers
var bus = WrapBus.create(function(operation) {
  // throw new Error('an error');
  return 'chunk'; // resolve data
});

// support for promises
var bus = WrapBus.create(function(operation) {
  return new Promise(function(resolve, reject) {
    resolve('chunk');
  });
});

var response = bus.execute({
  action: 'doSomething'
});

response.read().then(function(chunk) {
  // do something with chunk
});
```

#### ParallelBus([busses])

Executes an operation against multiple busses at the same time. Chunk data emitted by each bus is then merged into a single response in an un-ordered fashion.

```javascript
import { ParallelBus } from 'mesh';

var allWorkersBus = ParallelBus.create([
  WorkerBus.create({ script: __dirname + '/worker.js' }),
  WorkerBus.create({ script: __dirname + '/worker.js' })
]);

// ping all workers
var pingResponse = allWorkersBus.execute({
  action: 'ping'
});

pingResponse.readAll().then(function(pongs) {
  // handle pong data
});
```

#### SequenceBus([busses])

Executes operations against a each bus one at a time. Data is merged into one stream according to the order of each bus.

```javascript
var bus = SequenceBus.create([
  BufferedBus.create(void 0, 'a'),
  BufferedBus.create(void 0, 'b'),
  BufferedBus.create(void 0, 'c')
]);

bus.execute().read(function(chunks) {
  console.log(chunks); // [a, b, c]
});
```


#### FallbackBus([busses])

Executes one operation against all busses sequentially until one bus emits data.

```javascript
var bus = FallbackBus.create([
  APIBus.create('https://server1.com'),
  APIBus.create('https://server2.com')
]);

var response = bus.execute({ method: 'GET', path: '/api/users' });
response.readAll().then(function(response) {
  // handle response by one of the busses
});
```

#### RaceBus([busses])

Executes one operation against all busses in parallel until one bus emits data. The response data from the fastest bus is returned.

#### CatchBus(bus, catchErrorFunction)

Catches an error if one is emitted by the provided bus.

```javascript
var someBus = WrapBus.create(function() {
  throw new Error("whoops something went wrong!");
});

var bus = CatchBus.create(someBus, function(error) {

  // track error here

  // re-throw the error so it gets passed downstream
  throw error;
});


bus.execute({ }).catch(function(error) {
  // handle error
});
```

#### RandomBus([busses])

Picks one bus at random and executes an operation against it.

```javascript
var bus = RandomBus.create([
  BufferedBus.create(void 0, "a")
  BufferedBus.create(void 0, "b")
  BufferedBus.create(void 0, "c")
]);
await bus.execute().read(); // c
await bus.execute().read(); // a
await bus.execute().read(); // b
await bus.execute().read(); // b
```

#### RoundRobinBus([busses])

Picks one bus in rotation and executes an operation against it.

```javascript
var bus = RoundRobinBus.create([
  BufferedBus.create(void 0, "a")
  BufferedBus.create(void 0, "b")
  BufferedBus.create(void 0, "c")
]);
await bus.execute().read(); // a
await bus.execute().read(); // b
await bus.execute().read(); // c
await bus.execute().read(); // a
```

#### RetryBus(count, bus)

Re-executes operations against `bus` `count` times if an error occurs.

```javascript

var apiBus = WrapBus.create(function(operation) {
  return new Promise(function(resolve, reject) {
    request({
      url: "//apihost.com/" + operation.path,
      method: operation.action
    }, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
});

var bus = RetryBus(5, apiBus);

bus.execute({
  path: "/api/users",
  action: "GET"
}).readAll().then(function(users) {

});
```

#### DelayedBus(ms, bus)

Delays execution on the target bus for `ms` milliseconds. 

```javascript
var bus = DelayedBus.create(500, {
  execute: function(operation) {
    return BufferedResponse.create(void 0, "Hello World!");
  }
});

console.log(await bus.execute().read()); // Hello World!
```

#### NoopBus()

No-operation bus.

```javascript
var bus = NoopBus.create();

// does nothing
bus.execute().then(function() {

});
```

#### AcceptBus(filter, resolveBus[, rejectBus])

passes operations to `resolveBus` if `filter` returns `TRUE` against the executed operation. Otherwise the operation gets sent to `rejectBus`.

```javascript
var bus = AcceptBus.create(function(operation) {
  return operation.name = 'ping';
}, WrapBus.create(function() {
  return 'pong!';
}))

bus.execute({ name: 'ping' }) // pong!
bus.execute({ name: 'pong' }) // nothing happens. This is a no-op.
```

#### TailableBus(bus)

Creates a bus that can be tailed for all operations executed against it.

```javascript
var bus = TailableBus.create(NoopBus.create());
var tail = bus.createTail();

tail.pipeTo({
  write: function(operation) {
    // handle tailed operation - { action: "doSomething" }
  },
  close: function() { },
  abort: function() { }
});

// trigger tail
bus.execute({ action: "doSomething" });
```

#### RejectBus(filter, resolveBus[, rejectBus])

Similar to `AcceptBus`, but passes operations to `resolveBus` if `filter` returns `FALSE`.

#### MapBus(bus, mapFunction)

Maps the response chunks from `bus`.

```javascript
var bus = WrapBus.create(function(operation) {
  return operation.echo;
});
bus = MapBus.create(bus, function(chunkValue, writable, operation) {
  chunkValue.split('').forEach(writable.write.bind(writable));
});

bus.execute({ echo: 'hello' }); // ['h', 'e', 'l', 'l', 'o']
```

#### BufferedBus(error, [chunkValues])

Returns data specified in the constructor. Useful for testing.

```javascript

import expect from 'expect.js';
import { BufferedBus } from 'mesh';

// simple example of how you can use Mesh with models
class PersonModel {
  save() {
    return this._id ? this.insert() : this.update();
  }
  insert() {
    return this._run('insert', {
      data: this
    });
  }
  update() {
    return this._run('update', {
      data  : this,
      query : { _id: this._id }
    });
  }
  load() {
    return this._run('load', {
      query: { _id: this._id }
    });
  }
  remove() {
    return this._run('remove', {
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
import MongoDbBus from 'mesh-mongo-db-bus';
var bus = new MongoDbBus();
var person = new PersonModel({
  bus: new AttachDefaultsBus({ collection: 'people' }, bus),
  name: 'jeff'
});

await person.save(); // insert into mongodb
*/

it('can load data into the model', async function() {
  var person = PersonModel.create({
    bus: BufferedBus.create(void 0, { name: 'Mclaren Eff One' })
  });

  await person.load();

  expect(person.name).to.be('Mclaren Eff One');
});
```

#### AttachDefaultsBus(operationDefaults, bus)

Attaches default properties to executed operations.

```javascript
import { AttachDefaultsBus, WrapBus } from 'mesh';
import SocketIoBus from 'mesh-socket-io-bus';

var bus = WrapBus.create(function(operation) {
  console.log(operation.remote); // true
});

// each operation pushed from socket.io will be tagged as remote here
bus = SocketIoBus.create({
  host: '//127.0.0.1:8080'
}, AttachDefaultsBus.create({ remote: true }, bus));
```

## Response API

Responses are objects which are returned by [busses](#bus-api) whenever an operation is executed. They also provide a streamable interface similar to the upcoming [stream spec](http://streams.spec.whatwg.org).

#### Response(runFunction)

The base response class. Upon instantiation, `runFunction` is called immediately with a `writable` object provided in the first parameter. The `writable` implements `write`, `close`, and `abort` methods. These methods provide all the data for the response. Also note that `close`, or `abort` *must* be called to end the response.

```javascript
import { WrapBus, Response } from 'mesh';

var response = return Response.create(function(writable) {
  writable.write('chunk');
  writable.write('chunk');
  writable.close();
});

response.read().then(function(chunk) {
  console.log(chunk.vaue); // done
});

response.read().then(function(chunk) {
  console.log(chunk.value); // chunk
})


```

#### Promise response.read()

Reads one chunk written to the response. The chunk contains a `value` and `done` property. Done is set to `TRUE` if the response has closed.

```javascript
var response = Response.create(function(writable) {
  writable.write("pong");
  writable.close();
});
var chunk;
for ((chunk = response.read()) && !chunk.done) {
  console.log(chunk.value); // pong
}
```

#### Promise response.readAll()

Reads all the chunks from the response.

```javascript
var response = Response.create(function(writable) {
  writable.write("a");
  writable.write("b");
  writable.close();
});

response.readAll().then(function(buffer) {
  console.log(buffer); // [a, b]
});
```

#### response.pipeTo(writable)

Pipes the response to a writable stream.

```javascript
NodeStreamResponse
.create(fs.createReadStream(__filename))
.pipeTo({
  write: function(value) {
    // handle chunk value
  },
  close: function() {

  },
  abort: function(error) {

  }
})
```

#### response.then(closeCallback)

Calls `closeCallback` once the response has closed.

```javascript
var response = Response.create(function(writable) {
  writable.write("a");
  writable.close();
});

response.then(function() {
  // response closed
});
```

#### response.catch(abortCallback)

Calls `abortCallback` if the response has been aborted, or an error occurs.

```javascript
var response = Response.create(function(writable) {
  writable.abort(new Error("some error"))
});

response.catch(function(error) {
  console.log(error.message); // some error
});
```

#### BufferedResponse(error, [chunkValues])

Returns a response with pre-defined data

```javascript
var response = BufferedResponse.create(void 0, ["a", "b", "c"]);
response.read().then(function(chunk) {
  console.log(chunk.value); // a
});

// aborted response
var response = BufferedResponse.create(new Error("an error!"));
response.read().catch(function(error) {

});
```

#### EmptyResponse()

Returns an empty response

#### NodeStreamResponse(stream)

Wraps a node stream in a `Response` object.

```javascript
var response = NodeStreamResponse.create(fs.createReadStream(__filename));
response.read().then(function(chunk) {
  // handle chunk
});
```

#### ErrorResponse(error)

Returns an error response

```javascript
var bus = WrapBus.create(function(operation) {
  return ErrorResponse.create(new Error('an error'));
});

bus.execute().read().catch(function(error) {
  console.log(error); // an error
});
```
