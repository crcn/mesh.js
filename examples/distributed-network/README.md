Sample server demonstrating how you can use mesh to create a distributed, fault tolerant network. This
example supports `round robin`, `least connection`, and `random` load balancing algorithms.

This command line utility supports inline javascript. See below for details.

### Usage

First spin up some workers:

```
cd examples/network; node .
for (var i = 10; i--;) exec({ name: "startWorker" });
```

next, run the command:

```
exec({ name: "ping" });
```

This will execute a `ping` operation against all running workers.

## Supported operations

Below are a list of sample operations you can execute in the command line utility

#### { name: "startWorker" [, count: number ] }

starts a new worker

```javascript
exec({ name: "startWorker" }); // start 1 worker
exec({ name: "startWorker", count: 10 }); // start 10 workers
```

#### { name: "ping", dist: dist }

pings workers using the `dist` method. `dist` can be `rotate`, `least`, `random`, `sequence`,
or `parallel`.

```javascript
exec({ name: "ping" }); // start 1 worker
exec({ name: "ping", dist: "sequence" }); // ping all workers one after the other
exec({ name: "ping", dist: "random" }); // ping one random worker
exec({ name: "ping", dist: "rotate" }); // ping one worker, round-robin style
exec({ name: "ping", dist: "least" }); // ping the worker with the fewest running operations
```

#### { name: "trace", count: countdown, dist: dist }

runs `trace` operation against workers using the `dist` distribution type until `count` is 0. This
is a recursive operation.

```javascript
exec({ name: "ping", dist: "random", count 10 }); // ping one random worker until count is 0
```

#### { name: "error", message: message, dist: dist }

Demonstrates how the `master` server continues to re-execute an operation after it's failed
