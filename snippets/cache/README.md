This snippet caches operations. It's entirely customizable, and interoperable
with many adapters including [mesh-mongodb](https://github.com/mojo-js/mesh-mongodb), [mesh-local-storage](https://github.com/mojo-js/mesh-local-storage), [mesh-memory](https://github.com/mojo-js/mesh-memory), [mesh-loki](https://github.com/mojo-js/mesh-mongodb), and [mesh-http](https://github.com/mojo-js/mesh-http).

Usage:

```javascript
var cache   = require("./cache");
// var storage = require("mesh-local-storage");
var storage = require("mesh-memory");
var http    = require("mesh-http");

var bus = http();

bus     = cache(bus, {

  /**
   * where to store cached data
   */

  storage: storage({ ttl: 1000 * 10 }),

  /**
   * cache tester
   */

  cache  : function(operation) {
    return operation.method === "GET";
  },

  /**
   * generates queries to bust cache whenever an operation is executed
   */

  bust   : function(operation) {
    return /POST|UPDATE|DELETE/.test(operation.method) ? {
      path: operation.path
    } : void 0;
  }
});

// limit to 1 operation
bus = mesh.limit(1, bus);

bus({ path: "/friends", method: "GET" }); // GET /friends
bus({ path: "/friends", method: "GET" }); // cache hit
bus({ path: "/friends", method: "POST" }); // cache bust
bus({ path: "/friends", method: "GET" }); // GET /friends
bus({ path: "/friends", method: "GET" }); // cache hit
```

#### cache(bus, options)

- `bus` - the bus to cache
- `options` - options for caching
  - `storage` - the cache storage
  - `bust`    - creates a cache busting query
  - `query`   - creates a query to search for cached data
  - `cache`   - return `true` to cache the operation
