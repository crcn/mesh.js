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
          <iframe src={"/" + this.state.app.currentExampleUID}>

          </iframe> : 
          <h3>&lt;- Pick an example</h3>
      }
    </div>;
  }
});
