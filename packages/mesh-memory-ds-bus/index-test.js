var dsTestCases = require('mesh-ds-bus-test-cases');
var MemoryDsBus = require('./index');

describe(__filename + "#", function() {
  dsTestCases.create(MemoryDsBus.create.bind(MemoryDsBus)).forEach(function(tc) {
      it(tc.description, tc.run);
  });
});
