var Space     = require("./models/space");
var Group         = require("./models/group");
var Collider      = require("./models/collider");
var Sync          = require("./models/sync");
var Timer         = require("./models/timer");
var createBus     = require("./bus/server");
var entityFactory = require("./models/utils/entityFactory");

module.exports = function(app) {

  return;

  var bus = createBus(app);

  var entities = Group();

  var target = Space(entities);
  target     = Collider(target);
  target     = Sync({ entities: entities, bus: bus, createItem: entityFactory });

  new Timer({
    target: target,
    fps: 30
  }).start();
};
