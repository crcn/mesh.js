var caplet   = require("caplet");
var MainView = require("./views/main");
var React    = require("react");

var Application = caplet.createModelClass({

  /**
   */

  initialize: function() {

  },

  /**
   */

  render: function(options) {
    React.render(React.createElement(MainView), options.element);
  }
});

module.exports = Application;
