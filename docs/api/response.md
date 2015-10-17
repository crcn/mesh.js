
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
