Rate limit bus.


#### rateLimit(getUniqueId, limitStorage, bus, rateLimitedBus)

```javascript
var mesh       = require("mesh");
var mongodb    = require("mesh-mongodb");
var memory     = require("mesh-memory");
var rateLimit  = require("mesh/extra/rate-limit");
var express    = require("express");
var JSONStream = require("JSONStream");

var bus            = mongodb();
var rateLimitedBus = rateLimit(function(operation, next) {
  bus({ name: "load", collection: "apps", query: { _id: operation.key }})
  .on("error", next)
  .once("data", function(data) {
    next(void 0, data._id);
  });
}, memory(), bus, mesh.yields(new Error("you're bout to get throttled!")));

var server = express();

server.get("/messages/search", function(req, res) {
  rateLimitedBus({
    key: req.query.key,
    collection: "messages",
    query: { text: req.query.q }
  }).pipe(JSONStream.stringify()).pipe(res);
});

server.listen(8080);
```
