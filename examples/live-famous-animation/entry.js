var mesh   = require("../..");
var local = require("mesh-local-storage");

var clone = require("clone");
var caplet = require("caplet");
var meshlet = require("meshlet");
var Engine = require("famous/core/Engine");
var Surface = require("famous/core/Surface");
var Modifier = require("famous/core/Modifier");
var Transform = require("famous/core/Transform");
var TransitionableTransform = require("famous/transitions/TransitionableTransform");

var db = mesh.tailable(local({
  idProperty: "uid",
  storageKey: "famous"
}));

var dbs = {
  balls: mesh.child(db, { collection: "balls" })
};

var Ball = caplet.createModelClass({
  _db: dbs.balls,
  mixins: [meshlet.mixins.model]
});

var model = Ball({
  data: {
    uid: "ball2",
    active: false
  }
});

var leftHalf = document.createElement('div');
var rightHalf = document.createElement('div');

leftHalf.className = "half-horizontal left";
rightHalf.className = "half-horizontal right";

document.body.appendChild(leftHalf);
document.body.appendChild(rightHalf);

var contexts = {
  left: Engine.createContext(leftHalf),
  right: Engine.createContext(rightHalf),
};
var states = [];

Object.keys(contexts).map(function(k) {
  var ball = new Surface({
    size: [200, 200],
    properties: {
      backgroundColor: "#990000",
      borderRadius: "50%",
    },
  });

  var trans = new TransitionableTransform();
  var mod = new Modifier({
    transform: trans,
  });

  ball.move = function() {
    var pos = ball.active ? [300, 100, 0] : [0,0,0];

    trans.setTranslate(pos, {duration: 300});
  };

  ball.active = false;
  ball.on('click', function() {
    model.set("active", !model.active);
    model.save();
  });

  contexts[k].add(mod).add(ball);
  states.push({
    surface: ball,
    trans: trans,
  });
});

function changePos() {
  states.forEach(function(s) {
    s.surface.active = model.active;
    s.surface.move();
  });
}

caplet.watchProperty(model, "active", changePos);
model.load();
