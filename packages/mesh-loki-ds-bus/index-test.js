var dsTestCases = require('mesh-ds-bus-test-cases');
var LokiDsBus   = require('./index');
var co          = require('co');
var expect      = require('expect.js');

describe(__filename + "#", function() {
  dsTestCases.create(LokiDsBus.create.bind(LokiDsBus), {
    hasCollections: true
  }).forEach(function(tc) {
      it(tc.description, tc.run);
  });
});
