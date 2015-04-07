var mesh    = require("../..");
var io      = require("mesh-socket.io");

var iodb = io({
  host: "http://" + location.host,
  channel: "live-scribble"
});

// make it tailable locally
var db       = mesh.tailable(iodb);

var dbs = {
  points: mesh.child(db, { collection: "points" })
}

var canvas = document.createElement("canvas");
canvas.width = 1024;
canvas.height = 600;
paper.setup(canvas);

var path = new paper.Path();

path.strokeColor = 'black';

dbs.points(mesh.op("tail")).on("data", function(operation) {
  if (operation.name === "insert") insertPoint(operation);
  if (operation.name === "remove") removePoint(operation);
  if (operation.name === "update") updatePoint(operation);
  paper.view.draw();
});

var points = {};

function insertPoint(operation) {
  toArray(operation.data).forEach(function(data) {
    var point = points[data.id] = new paper.Point(data.x, data.y);
    path.add(point);
  });
}

function removePoint(operation) {
  toArray(operation.data).forEach(function(data) {
    var point = points[data.id];
    path.removeSegment(point);
  });
}

function updatePoint(operation) {
  toArray(operation.data).forEach(function(data) {
    var point = points[data.id];
    point.x = data.x;
    point.y = data.y;
  });
}


function toArray(data) {
  if (data == void 0) return [];
  return Object.prototype.toString.call(data) === "[object Array]" ? data : [data];
}

var _draw;
$(document).mousedown(function() {
  _draw = true;
});

$(document).mousemove(function(event) {
  if (!_draw) return;
  dbs.points(mesh.op("insert", {
    data: { id: event.timeStamp, x: event.clientX, y: event.clientY }
  }));
});

$(document).mouseup(function() {
  _draw = false;
});

document.body.appendChild(document.createTextNode("start doodling!"));
document.body.appendChild(canvas);
