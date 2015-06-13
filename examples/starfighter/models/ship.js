var _nonew = require("./_nonew");
var Base   = require("./entity");
var bullet = require("./bullet");
var grp    = require("./utils/getRotationPoint");

/**
 */

function Ship(properties) {
  Base.call(this, properties);
}

/**
 */

Base.extend(Ship, {

  /**
   */

  type        : "ship",
  width       : 30,
  height      : 30,
  maxVelocity : 10,

  /**
   */

  fire: function() {

    var p = grp(this);

    // find the middle of the ship
    var x = this.x + this.width/2;
    var y = this.y + this.height/2;

    // add rotation & move position to end of ship.
    x += p.x * (this.width/2);
    y += p.y * (this.height/2);


    this.emit("child", bullet({
      syncUpdate : false,
      x          : x,
      y          : y,
      rotation   : this.rotation,
      velocity   : 10
    }));
  },

  /**
   * updates the entity
   */

  move: function(vDelta, rDelta) {
    // this.velocity =  Math.min(this.maxVelocity, Math.max(0, this.velocity + vDelta || 0));
    this.velocity = 10;
    this.rotation = (this.rotation + rDelta) % 360;
  }
});

/**
 */

module.exports = _nonew(Ship);
