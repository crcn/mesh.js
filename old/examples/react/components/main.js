var React     = require("react");
var Header    = require("./header");
var Items     = require("./items");
var loadState = require("./_loadState");
var extend    = require("extend");

var Main = React.createClass({
  componentDidMount: function() {
    this._load();

    // wait for operations to finish, then reload the root
    this.props.bus({ name: "tail" }).on("data", this._load.bind(this));
  },
  getInitialState: function() {
    return {
      items: []
    };
  },
  _load: function() {
    loadState({
      items: { name: "getItems", multi: true }
    }, this.props.bus, function(err, state) {
      this.setState(state);
    }.bind(this));
  },
  render: function() {
    return React.createElement("div", { className: "row" },
      React.createElement("div", { className: "col-sm-12" },
        React.createElement(Header, this.props),
        React.createElement(Items, extend({}, this.state, this.props))
      )
    );
  }
});

module.exports = Main;
