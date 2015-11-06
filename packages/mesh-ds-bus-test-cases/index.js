var cases  = [];
var expect = require('expect.js');
var mesh   = require('mesh');


exports.create = function(busClass) {

  function it(desc, run) {
      cases.push({ description: desc, run: run });
  }

  it('can insert() data', function() {

  });

  return cases;
}
