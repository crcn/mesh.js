var React  = require("react");

var Item = React.createClass({
  removeItem: function(event) {
    event.preventDefault();
    this.props.bus({ name: "removeItem", query: { id: this.props.item.id } });
  },
  render: function() {
    return React.createElement("li", void 0,
      React.createElement("button", { onClick: this.removeItem }, "x"),
      " " + this.props.item.text
    );
  }
});

module.exports = Item;
