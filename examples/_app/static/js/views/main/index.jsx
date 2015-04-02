var React   = require("react");
var Sidebar = require("./sidebar");
var Example = require("./example");

module.exports = React.createClass({
  render: function() {
    return <div className="container main">
      <div className="row">
        <div className="col-sm-2">
          <Sidebar />
        </div>
        <div className="col-sm-10">
          <Example />
        </div>
      </div>
    </div>;
  }
})
