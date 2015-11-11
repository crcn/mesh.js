var dsTestCases = require('mesh-ds-bus-test-cases');
var MemoryDsBus = require('./index');
var co          = require('co');
var expect      = require('expect.js');

describe(__filename + "#", function() {

  dsTestCases.create(MemoryDsBus.create.bind(MemoryDsBus), {
    hasCollections: true
  }).forEach(function(tc) {
      it(tc.description, tc.run);
  });

  it('throws a descriptive error message if data doesn\'t exist on insert', co.wrap(function*() {
    var err;

    try {
      yield MemoryDsBus.create().execute({ action: 'insert', collection: 'abba' });
    } catch(e) {
      err = e;
    }

    expect(err.message).to.contain('data must exist');
  }));
});
