var http = require("crudlet-http");
var crudlet = require("../../../../..");

module.exports = function() {

  var httpdb = http();

  // db is the default NS we wanna use - just re-assign
  // httpdb
  var db = httpdb;


  // return the collections
  return {
    examples: crudlet.child(db, { collection: "api/examples"})
  };
}
