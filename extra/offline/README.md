TODO

Offline-mode plugin. This adapter stores operations, and executes them against a remote data source
when the app comes back online

Usage

```javascript
var offline = require("./offline");
var storage = require("mesh-memory");
var api     = http();

var store   = offline(api(), storage());

var bus = function(operation) {

  if (isOffline) {
    operation.offline = true;
  }

  return store(operation);
}

```
