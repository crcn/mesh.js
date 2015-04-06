var http = require("meshlet-http");
var meshlet = require("../../../../..");

module.exports = function() {

  var httpdb = http({ prefix: "/api" });

  // db is the default NS we wanna use - just re-assign
  // httpdb
  var db = httpdb;


  // return the collections
  return {
    examplesDb: meshlet.top(meshlet.child(db, { collection: "examples" }))
  };
}
