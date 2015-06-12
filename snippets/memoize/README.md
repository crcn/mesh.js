This snippet [caches](http://en.wikipedia.org/wiki/Memoization) operations. It's entirely customizable, and interopab


Usage:

```javascript
var cache   = require("./cache");
var storage = require("mesh-local-storage");
var http    = require("mesh-http");

var bus = http();
bus     = cache(bus, {
  storage: storage({ ttl: 1000 * 10 }),
  bust   : function(operation) {
    return /POST|UPDATE|DELETE/.test(operation.method) ? {
      path: operation.path
    }, void 0
  }
});
```
