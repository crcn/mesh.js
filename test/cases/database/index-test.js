var expect      = require("expect.js");
var createCases = require("./index");
var memory      = require("mesh-memory");

describe(__filename + "#", function() {

  var cases = createCases(function(options) {
    return memory(options);
  });

  for (var name in cases) it(name, cases[name]);
});
