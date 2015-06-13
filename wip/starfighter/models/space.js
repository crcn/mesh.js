var Base   = require("./entity");
var _nonew = require("./_nonew");
var group  = require("./group");
var grp    = require("./utils/getRotationPoint");

/**
 */

function Space(entities) {
  Base.call(this, { entities: entities || group() });
}

/**
 */

Base.extend(Space, {

  /**
   */

  width  : Infinity,
  height : Infinity,

  /**
   */

  getItems: function() {
    return this.entities.getItems();
  },

  /**
   */

  update: function() {
    this.entities.update();
    var es = this.getItems();
    for (var i = es.length; i--;) {
      var entity = es[i];
      if (entity.velocity <= 0) continue;

      var p = grp(entity);

      var x = Math.round(p.x * entity.velocity);
      var y = Math.round(p.y * entity.velocity);

      entity.x = entity.x + x;
      entity.y = entity.y + y;
    }
  }
});

module.exports = _nonew(Space);
