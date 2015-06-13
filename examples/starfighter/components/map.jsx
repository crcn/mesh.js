var React  = require("react");
var cx     = require("classnames");

module.exports = React.createClass({
  render: function() {

    var ships = this.props.entities.items.filter(function(entity) {
      return entity.type === "ship";
    });

    var scale = 10;

    s = {
      width: 200,
      height: 200
    };

    return <div className="map" style={s}>
      {
        ships.map(function(ship) {
          var s = {
            top: ship.y / scale,
            left: ship.x / scale
          }

          var c = cx({
            dot: true
          });

          return <div className={c} style={s}></div>
        })
      }
    </div>;
  }
});
