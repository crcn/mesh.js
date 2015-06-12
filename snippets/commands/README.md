Usage:

```javascript
var commands = require("./commands");

var bus = commands({
  popup: function(operation, next) {

  }
});

bus({ name: "popup" });

```
