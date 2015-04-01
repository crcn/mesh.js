var express    = require("express");
var browserify = require("browserify-middleware");


var port = process.env.PORT || 8080;

var server = express();
server.use("/js/entry.bundle.js", browserify(__dirname + "/static/js/entry.js", {
  extensions: [".jsx"],
  transform: "reactify"
}));

server.use(express.static(__dirname + "/static"));

server.listen(port)
