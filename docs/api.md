## Bus API

#### WrapBus(executeFunction)

Wraps `fn` as a

```javascript

// support for es7 await
var bus = new WrapBus(async function(operation) {
  await
});

```

#### ParallelBus([busses])

#### SequenceBus([busses])

#### FallbackBus([busses])

#### RaceBus([busses])

#### RetryBus(count, bus)

#### CatchBus(bus, catchErrorFunction)

#### NoopBus()

#### AcceptBus(filter, resolveBus, rejectBus)

#### RejectBus(filter, resolveBus, rejectBus)

#### MapBus(bus, mapFunction)

#### BufferedBus(error, [chunkValues])

#### AttachDefaultsBus(operationDefaults, bus)

## Response API

#### BufferedResponse(error, [chunkValues])

#### EmptyResponse()

#### AsyncResponse(runFunction)

#### NodeStreamResponse(stream)

#### ErrorResponse(error)
