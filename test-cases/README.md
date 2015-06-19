various test cases you should run if you plan on creating a mesh adapter.

# Database test cases

Docs can be [viewed here](http://meshjs.herokuapp.com/docs/database-adapters).

Test case usage:

```javascript
var createDBCases = require("mesh/test-cases/database");
var memory        = require("mesh-memory");

describe("in-memory-adapter#", function() {

  // createCases(createBus)
  var cases = createDBCases(function(options) {
    return memory(options);
  });

  for (var name in cases) it(name, cases[name]);
});
```
