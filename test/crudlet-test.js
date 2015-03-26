var crudlet = require("../");

describe(__filename + "#", function() {

  it("can be created", function() {
    var db = crudlet(
      crudlet.db.memory()
    );
  });
});