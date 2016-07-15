var dsTestCases = require('mesh-ds-bus-test-cases');
var ArrayDsBus  = require('./index');

describe(__filename + "#", function() {
  dsTestCases.create(ArrayDsBus.create.bind(ArrayDsBus)).forEach(function(tc) {
      it(tc.description, tc.run);
  });
});
