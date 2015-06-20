var expect      = require("expect.js");
var createCases = require("../../test-cases/database");
var createDb    = require("./database");

describe(__filename + "#", function() {
  var cases = createCases(createDb);
  for (var name in cases) it(name, cases[name]);
});
