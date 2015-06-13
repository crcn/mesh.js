module.exports = function(entity) {

  // return;
  var rotation = 180-entity.rotation;

  if (rotation < 0) {
    rotation = 360 + rotation;
  }

  return {
    x: Math.sin(rotation / 180 * Math.PI),
    y: Math.cos(rotation / 180 * Math.PI)
  };
}
