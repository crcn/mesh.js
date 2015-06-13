var React           = require("react");
var SpaceComponent  = require("./space");
var Entity          = require("./entity");
var MapComponent    = require("./map");

var Space         = require("../models/space");
var Viewport      = require("../models/viewport");
var Group         = require("../models/group");
var Timer         = require("../models/timer");
var Player        = require("../models/player");
var Ship          = require("../models/ship");
var Sync          = require("../models/sync");
var Throttle      = require("../models/throttle");
var bus           = require("../bus/browser")();
var entityFactory = require("../models/utils/entityFactory");


/**
 */

module.exports = React.createClass({

  /**
   */

  getInitialState: function() {

    var entities = Group();
    var space    = Space(entities);
    var viewport = Viewport({ space: space });
    var timer    = Timer({ target: this, fps: 30 });
    var sync     = Throttle({
      target: Sync({ entities: entities, bus: bus, createItem: entityFactory }),
      timeout: 1000/5
    });


    return {
      sync     : sync,
      timer    : timer,
      viewport : viewport,
      space    : space,
      entities : space.entities
    }
  },

  /**
   */

  componentDidMount: function() {
    this._initShips();
    this.state.timer.start();
  },

  /**
   */

  render: function() {

    var space    = this.state.space;
    var viewport = this.state.viewport;
    var entities = this.state.entities;

    return <div id="map" ref="viewport" tabIndex="0" className="example-startfighter">
      <SpaceComponent space={space} entities={this.state.entities.items.filter(function(entity) {
        return viewport.canSee(entity);
      })} />
      <MapComponent entities={entities} focus={this._ship} />
    </div>
  },

  /**
   */

  _initShips: function() {

    var ship = Ship({
      maxVelocity : 10,
      x           : 100 + Math.round(Math.random() * 500),
      y           : 100 + Math.round(Math.random() * 600)
    });

    this.state.viewport.focus = ship;

    this.state.player = Player({ ship: ship, element: document.body });
    this.state.entities.add(ship);
  },

  /**
   */

  update: function() {

    var vpNode      = this.refs.viewport.getDOMNode();
    var viewport    = this.state.viewport;
    viewport.width  = vpNode.offsetWidth;
    viewport.height = vpNode.offsetHeight;

    this.state.player.update();
    this.state.viewport.update();
    this.state.space.update();
    this.state.sync.update();

    this.setState({ space: this.state.space });
  }
});
