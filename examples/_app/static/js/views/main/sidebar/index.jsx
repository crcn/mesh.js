var React = require("react");
var _     = require("highland");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      examples: []
    }
  },
  componentDidMount: function() {
    var self = this;
    app.db.examplesDb("load", { multi: true }).
    pipe(_.pipeline(_.collect)).
    on("data", function(examples) {
      self.setState({ examples: examples });
    });
  },
  render: function() {
    var self = this;
    return <div className="row sidebar">
      <ul>
        {
          (this.state.examples || []).map(function(example) {
            return <li>
              <a href={"#/" + example.name }>{ String(example.name).replace(/-/g," ") }</a>
            </li>;
          })
        }
      </ul>
    </div>;
  }
});
