var express    = require("express");
var browserify = require("browserify");
var fs         = require("fs");
var watchify   = require("watchify");
var extend     = require("xtend/mutable");
var less       = require("less");
var glob       = require("glob");
var io         = require("socket.io");
var iowc       = require("socketio-wildcard");


var port = process.env.PORT || 8080;

var server = express();

var _bundles = {};


function bundleEntryMiddleware(pathname) {
  var ops = extend({ extensions: [".jsx"] }, watchify.args);

  var b = browserify(ops);
  b = watchify(b);
  b.add(pathname);
  b.transform("reactify");

  return function(req, res) {
    b.bundle().pipe(res);
  }
}

function addBundleable(routeName, pathname) {
  server.use(routeName, bundleEntryMiddleware(pathname));
}

addBundleable("/js/entry.bundle.js", __dirname + "/static/js/entry.js");

var staticMiddleware = express.static(__dirname + "/static");
var examples = [];
server.use(staticMiddleware);

fs.readdirSync(__dirname + "/../").filter(function(name) {
  return /^(live-|famous-)/.test(name)
}).forEach(function(name) {

  var dirname =  __dirname + "/../" + name;
  examples.push({ name: name });
  addBundleable("/" + name + "/entry.bundle.js", dirname + "/entry.js");
  server.use("/" + name, staticMiddleware);

  var serverFile = dirname = "/server.js";
  if (fs.existsSync(serverFile)) require(serverFile)(server);
});

server.get("/css/bundle.css", function(req, res) {
  var buffer = [];
  glob.sync(__dirname + "/../**/*.less").forEach(function(file) {
    buffer.push(fs.readFileSync(file, "utf8"));
  });

  less.render(buffer.join("\n"), function(err, out) {
    res.send(out.css);
  });
});

server.get("/api/examples", function(req, res) {
  res.send(examples);
});



var ioserver = io(server.listen(port));
ioserver.use(iowc());

ioserver.on("connection", function(connection) {

  connection.on("*", function (message) {
    connection.broadcast.emit(message.data[0], message.data[1]);
  });

  connection.on("close", function() {
    console.log("D");
  });
});
