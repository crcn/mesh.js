This snippet caches `GET` responses from `load` requests. It's interoperable with any database adapter including
[mesh-http]()


Usage:

```javascript
var cache        = require("./cache-load");
var mapHttp      = require("./map-http");
var http         = require("mesh-http");
var localStorage = require("mesh-local-storage");

var bus = http({ prefix: "/api" });

// map CRUD methods to the proper API request
// bus     = mapHttp([
//   {
//     test: {
//       name: /insert|remove|update|delete/,
//       collection: "friends"
//     },
//     transform: function(operation) {
//
//       var path =
//       return {
//         path: "/" + operation.collection,
//         method: {
//           insert: "POST",
//           remove: "DELETE",
//           load  : "GET",
//           update: "PUT"
//         }[operation.name]
//       };
//     }
//   }
// ], bus);

bus = cache(bus, localStorage({ ttl: 3600 * 60 }));

```
