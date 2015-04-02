var caplet = require("caplet");
var _      = require("highland");

module.exports = caplet.createCollectionClass({
  modelClass: require("./example"),
  load: function() {
    var self = this;
    app.db.examples("load", { multi: true }).pipe(_.pipeline(_.collect)).on("data", function(data) {
      console.log(data);
      self.set("data", data);
    });
  }
});
