var express = require("express");
var mesh    = require("mesh");
var memory  = require("mesh-memory");
var _       = require("highland");

var db = memory();



var server = express();

// user

server.get("/getUsers", function() {

});

server.post("/register", function() {

});

server.post("/updateUser", function() {

});

server.post("/addFriend", function() {

});

// room

server.get("/getRooms", function() {

});

server.post("/addRooms", function() {

});

// messages

server.get("/getMessages", function() {

});

server.post("/addMessage", function() {

});




server.listen(process.env.PORT || 8080);
