var express    = require("express");
var browserify = require("browserify-middleware");


var server = express();
server.use("/index.bundle.js", browserify(__dirname + "/index.js"));
server.use(express.static(__dirname));
// server.post("/clients", fun)
server.listen(8080);