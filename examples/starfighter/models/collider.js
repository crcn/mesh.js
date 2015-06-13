var Base   = require("./entity");
var _nonew = require("./_nonew");
var group  = require("./group");
var grp    = require("./utils/getRotationPoint");

/**
 */

function Collider(entities) {
  Base.call(this, { entities: entities || group() });
}

/**
 */

Base.extend(Collider, {

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

      var e1 = es[i];
      if (!e1) continue;

      if (e1.type !== "ship") continue;

      var e1xs = e1.x;
      var e1xe = e1xs + e1.width;
      var e1ys = e1.y;
      var e1ye = e1ys + e1.height;

      for (var j = es.length; j--;) {
        var e2 = es[j];

        if (e1 === e2 || e2.ownerId === e1.cid) continue;

        var e2xs = e2.x;
        var e2xe = e2xs + e2.width;
        var e2ys = e2.y;
        var e2ye = e2ys + e2.height;

        if (!(e1ys > e2ye || e1xe < e2xs || e1ye < e2ys || e1xs > e2xe)) {

          e1.dispose();
          e2.dispose();
          break;
        }
      }
    }
  }
});

module.exports = _nonew(Collider);
