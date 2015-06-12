var React  = require("react");
var Item   = require("./item");
var extend = require("extend");

var Items = React.createClass({
  render: function() {
    return React.createElement("ul", { className: "item" },
      this.props.items.map(function(item) {
        return React.createElement(Item, extend({ item: item }, this.props))
      }.bind(this))
    );
  }
});

module.exports = Items;
