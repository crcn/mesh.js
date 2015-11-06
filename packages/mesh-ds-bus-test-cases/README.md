Usage:

```javascript
var meshDbTestCases = require('mesh-db-test-cases');
meshDbTestCases.forEach(function(case) {
	it(case.description, case.run);
});
```
