TODO:

Offline-mode plugin. This utility stores `CRUD` operations temporarily to whatever local data store you want. When your app
goes back online, this adapter will diff changes to the local storage, and re-persist data back to your *remote* data source.

Usage:

```javascript
var mesh         = require("mesh");
var localStorage = require("mesh-local-storage");
var offline      = require("./offline");
var http         = require("mesh-http");


var api  = http();
var bus  = offline(api(), {
  storage: localStorage(),
  testError: function(err) {
    return !!~err.message.indexOf("ECONREFUSED");
  }
});




```

Caveats:


<!-- Offline-mode is a bit limited in functionality since it  -->
