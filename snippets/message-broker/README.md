Simple message broker that supports `parallel`, `sequence`, `roundRobin`, `random`, `leastConnection`, and `fastest` load balancing algorithms. All
load balancing algorithms can be weighted to prioritize certain busses over others.


#### broker(workers[, weights])

```javascript
var broker = require("./message-broker");
var http   = require("mesh-http");

var workers = [
  "api1.server.com",
  "api2.server.com",
  "api3.server.com",
  "api4.server.com"
].map(function(url) {
  return http({ prefix: url });
});

var bus = broker(workers);

// execute this in parallel
bus({
  path: "/ok",
  dist: "parallel"
});

bus({
  path: "/doWork",
  data: { /* body here */ },
  dist: "roundRobin"
});

bus({
  path: "/doWork",
  data: { /* body here */ },
  dist: "least"
});
```

Weighted distribution:

```javascript
var workers = [
  "api1.server.com",
  "api2.server.com",
  "api3.server.com",
  "api4.server.com"
].map(function(url) {
  return http({ prefix: url });
});
```

TODO:

- [ ] weighted option
  - [ ] ability to change weights based on operation response
