var dsTestCases   = require('mesh-ds-bus-test-cases');
var CollectionBus = require('./index');

describe(__filename + "#", function() {
  dsTestCases.create(CollectionBus.create.bind(CollectionBus)).forEach(function(tc) {
      it(tc.description, tc.run);
  });
});
