var React  = require("react");
var Entity = require("./entity");

module.exports = React.createClass({
  render: function() {

    var s = {
      top: this.props.space.y,
      left: this.props.space.x
    };

    return <div className="space" style={s}> {
        this.props.entities.map(function(entity) {
          return <Entity key={entity.cid} entity={entity} />
        }.bind(this))
      }
    </div>
  }
});
