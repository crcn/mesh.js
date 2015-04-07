var React   = require("react");
var caplet  = require("caplet");

module.exports = React.createClass({
  mixins: [caplet.watchModelsMixin],
  getInitialState: function() {
    return {
      app: app
    };
  },
  render: function() {
    var self = this;
    return <div className="row example">
      {
        this.state.app.currentExampleUID ?
          <div>
            <a href={"https://github.com/mojo-js/mesh.js/tree/master/examples/" + this.state.app.currentExampleUID }>
              View {this.state.app.currentExampleUID} source
            </a>
            <iframe src={"/" + this.state.app.currentExampleUID}>

            </iframe>
          </div>:
          <h3>&lt;- Pick an example</h3>
      }
    </div>;
  }
});
