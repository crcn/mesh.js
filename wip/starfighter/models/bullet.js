var _nonew     = require("./_nonew");
var Base       = require("./entity");

/**
 */

function Bullet(properties) {
  Base.call(this, properties);
}

/**
 */

Base.extend(Bullet, {

  /**
   */

  type   : "bullet",
  width  : 2,
  height : 5,
  ttl    : 1000 * 5,

  /**
   */

  update: function() {
    if (Date.now() > this.ts + this.ttl) {
      this.dispose();
    }
  }

});

/**
 */

module.exports = _nonew(Bullet);
