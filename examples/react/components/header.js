var React  = require("react");

var Item = React.createClass({
  addItem: function(event) {
    event.preventDefault();
    var ref = React.findDOMNode(this.refs.textInput);
    var text = ref.value;
    ref.value = "";
    this.props.bus({
      name: "addItem",
      data: { text: text }
    })
  },
  render: function() {
    return React.createElement("div", void 0,
      React.createElement("form", { onSubmit: this.addItem },
        React.createElement("input", { ref: "textInput", name: "item", className: "form-control" })
      )
    );
  }
});

module.exports = Item;
