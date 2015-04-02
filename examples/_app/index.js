var express    = require("express");
var browserify = require("browserify");
var fs         = require("fs");
var watchify   = require("watchify");
var extend     = require("xtend/mutable");
var less       = require("less");
var glob       = require("glob");


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
  return !/^(_|\.)/.test(name);
}).forEach(function(name) {
  examples.push({ name: name });
  addBundleable("/" + name + "/entry.bundle.js", __dirname + "/../" + name + "/entry.js");
  server.use("/" + name, staticMiddleware);
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



server.listen(port)
