var caplet   = require("caplet");
var MainView = require("./views/main");
var React    = require("react");
var createDb = require("./db");
var routes   = require("./routes");

var Application = caplet.createModelClass({

  /**
   */

  initialize: function() {
    routes(this);
    this.db = createDb();
  },

  /**
   */

  render: function(options) {
    React.render(React.createElement(MainView), options.element);
  }
});

module.exports = Application;
