var React   = require("react");
var caplet  = require("caplet");

module.exports = React.createClass({
  mixins: [caplet.watchModelsMixin],
  showExample: function(example) {

  },
  getInitialState: function() {
    return {
      examples: app.examples
    };
  },
  render: function() {
    var self = this;
    return <div className="row sidebar">
      <ul>
        {
          this.state.examples.map(function(example) {
            return <li>
              <a href={"#/" + example.uid }>{ String(example.name).replace(/-/g," ") }</a>
            </li>;
          })
        }
      </ul>
    </div>;
  }
});
