var http = require("mesh-http");
var mesh = require("../../../../..");

module.exports = function() {

  var httpdb = http({ prefix: "/api" });

  // db is the default NS we wanna use - just re-assign
  // httpdb
  var db = httpdb;


  // return the collections
  return {
    examplesDb: mesh.top(mesh.child(db, { collection: "examples" }))
  };
}
