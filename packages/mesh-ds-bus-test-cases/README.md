Installation:

`npm install mesh-ds-bus-test-cases`

Usage:

```javascript
var dsTestCases = require('mesh-ds-bus-test-cases');
var MemoryDsBus = require('mesh-memory-ds-bus');

dsTestCases.create(MemoryDsBus.create.bind(MemoryDsBus)).forEach(function(tc) {
    it(tc.description, tc.run);
});

```
