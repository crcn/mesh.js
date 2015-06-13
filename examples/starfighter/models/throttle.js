var Base   = require("./base");
var _nonew = require("./_nonew");

/**
 */

function Throttle(properties) {
  Base.call(this, properties);
}

/**
 */

Base.extend(Throttle, {
  timeout: 50,
  update: function() {
    if (!this.ts || Date.now() > (this.ts + this.timeout)) {
      this.ts = Date.now();
      this.target.update();
    }
  }
});

/**
 */

module.exports = _nonew(Throttle);
