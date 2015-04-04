var http = require("crudlet-http");
var crudlet = require("../../../../..");

module.exports = function() {

  var httpdb = http({ prefix: "/api" });

  // db is the default NS we wanna use - just re-assign
  // httpdb
  var db = httpdb;


  // return the collections
  return {
    examplesDb: crudlet.top(crudlet.child(db, { collection: "examples" }))
  };
}
