var Base   = require("./base");
var extend = require("xtend/mutable");
var _nonew = require("./_nonew");

/**
 */

function Player(properties) {
  Base.call(this, properties);
  this._keys    = {};
  this.initialize();
}

/**
 */

Base.extend(Player, {
  initialize: function() {
    this.element.addEventListener("keydown", this._onMouseDown.bind(this));
    this.element.addEventListener("keyup", this._onMouseUp.bind(this));
  },
  update: function() {

    var vDelta = 0;
    var rDelta = 0;

    for (var c in this._keys) {
      c = Number(c);
      var isDown = this._keys[c];

      if (isDown && c === 39) {
        rDelta = 10;
      } else if (isDown && c === 37) {
        rDelta = -10;
      } else if (c === 38) {
        if (isDown) {
          vDelta = 1;
        } else {
          vDelta = -0.5;
        }
      } else if (c === 32 && !isDown) {
        delete this._keys[c];
        this.ship.fire();
      }
    }

    this.ship.move(vDelta, rDelta);
  },
  _onMouseDown: function(event) {
    this._keys[event.keyCode] = true;
  },
  _onMouseUp: function(event) {
    this._keys[event.keyCode] = false;
  }
});

/**
 */

module.exports = _nonew(Player);
