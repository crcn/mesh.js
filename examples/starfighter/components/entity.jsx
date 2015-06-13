var React  = require("react");
var Ship   = require("./ship");
var Bullet = require("./bullet");
var caplet = require("caplet");
var cx     = require("classnames");
var grp    = require("../models/utils/getRotationPoint");

module.exports = React.createClass({
  render: function() {
    var e = this.props.entity;
    var p = grp(e);

    var matrix = [-p.y, p.x, -p.x, -p.y, e.x, e.y];

    var s = {
      width: e.width + 'px',
      height: e.height + 'px',
      transform: 'matrix(' + matrix + ')'
    };

    var c = cx({
      entity: true
    });

    return <div className={c} style={s}>{{
      ship   : <Ship entity={e} />,
      bullet : <Bullet entity={e} />
    }[this.props.entity.type]}</div>;
  }
});
