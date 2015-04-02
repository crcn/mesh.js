var caplet   = require("caplet");
var MainView = require("./views/main");
var React    = require("react");
var createDb = require("./db");
var models   = require("./models");
var routes   = require("./routes");

var Application = caplet.createModelClass({

  /**
   */

  initialize: function() {
    routes(this);
    this.db       = createDb();
    this.examples = models.Examples();
  },

  /**
   */

  render: function(options) {
    React.render(React.createElement(MainView), options.element);
    this.examples.load();
  }
});

module.exports = Application;
