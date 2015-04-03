var db      = require("./db");
var cluster = require("fourk")();
var extend  = require("xtend/mutable");
var view    = require("./view");


function Application() {
  this.db = db;
}

extend(Application.prototype, {
  initialize: function(element) {
    view(this, element);
  }
});

var app = new Application();

if (cluster.isMaster) {
  app.initialize(document.body);
}
