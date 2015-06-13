var Base   = require("./base");
var _nonew = require("./_nonew");

/**
 */

function Viewport(properties) {
  Base.call(this, properties);
}

/**
 */

module.exports = Base.extend(Viewport, {

  /**
   * padding for the focused element
   */

  padding: 100,

  /**
   */

  update: function() {
    if (!this.focus) return;

    var fx = this.focus.x;
    var fy = this.focus.y;

    var vx = this.space.x + fx;
    var vy = this.space.y + fy;

    var pw = this.width  - this.padding;
    var ph = this.height - this.padding;

    if (vx > pw) this.space.x = pw - fx;
    if (vy > ph) this.space.y = ph - fy;
    if (vx < this.padding) this.space.x = this.padding - fx;
    if (vy < this.padding) this.space.y = this.padding - fy;
  },

  /**
   */

  canSee: function(entity) {
    var vx = this.space.x + entity.x;
    var vy = this.space.y + entity.y;

    return vx > 0 && vx < this.width && vy > 0 && vy < this.height;
  }
});

/**
 */

module.exports = _nonew(Viewport);
