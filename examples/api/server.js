var express = require("express");
var mesh    = require("mesh");
var memory  = require("mesh-memory");
var _       = require("highland");

var db = memory();



var server = express();


server.get("/user", function() {
  
});



server.listen(process.env.PORT || 8080);
