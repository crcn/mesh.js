var Base   = require("./base");
var _nonew = require("./_nonew");

function Timer(properties) {
  Base.call(this, properties);
}

Base.extend(Timer, {
  fps: 30,
  start: function() {
    this.stop();
    this._timer = setInterval(this.target.update.bind(this.target), 1000/this.fps);
  },
  stop: function() {
    clearInterval(this._timer);
  }
});

module.exports = _nonew(Timer);
