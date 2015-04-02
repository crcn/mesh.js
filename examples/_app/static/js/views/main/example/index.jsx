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
      <iframe src={"/" + this.state.app.currentExampleUID}>

      </iframe>
    </div>;
  }
});
