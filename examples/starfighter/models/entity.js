var Base       = require("./base");
var extend     = require("xtend/mutable");
var observable = require("./mixins/observable");
var crc32      = require("crc32");

/**
 */

var _i = 0;

function _createCID() {
  return crc32((++_i) + "." + Date.now() + "." + (Math.round(Math.random() * 999999)));
}

/**
 */

function Entity(properties) {
  this.cid = _createCID();
  this.ts  = Date.now();
  Base.call(this, properties);
};

/**
 */

Base.extend(Entity, observable, {

  /**
   */

  x        : 0,
  y        : 0,
  rotation : 0,
  velocity : 0,
  width    : 0,
  height   : 0,

  /**
   */

  dispose: function() {
    this.emit("dispose");
  },


  /**
   */

  toJSON: function() {
    return {
      type     : this.type,
      cid      : this.cid,
      x        : this.x,
      y        : this.y,
      rotation : this.rotation,
      velocity : this.velocity
    };
  }
});

/**
 */

module.exports = Entity;
