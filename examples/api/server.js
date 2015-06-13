var express    = require("express");
var mesh       = require("../..");
var memory     = require("mesh-memory");
var _          = require("highland");
var models     = require("./models");
var createBus  = require("./bus");
var JSONStream = require("JSONStream");
var stream     = require("obj-stream");

var db = memory();

var _id = 0;
var bus = mesh.accept("insert", function(operation) {
  operation.data.id = operation.collection + (++_id);
  return db(operation);
}, db);

bus          = createBus({}, bus);

bus.users    = mesh.attach({ collection: "users"    }, bus);
bus.threads  = mesh.attach({ collection: "threads"  }, bus);
bus.messages = mesh.attach({ collection: "messages" }, bus);

var server = express();


function objToKeyStream() {
  return stream.through(function(data, next) {
    for (var key in data) this.push([key, data[key]]);
    next();
  });
}

server.post("/register", function() {

});

server.post("/updateUser", function() {

});

server.post("/addFriend", function() {

});

// room

server.get("/getThreads", function(req, res) {
  bus.threads({
    name: "load",
    multi: true
  }).pipe(JSONStream.stringify()).pipe(res);
});

server.get("/addThread", function(req, res) {
  bus.threads({
    name: "insert",
    data: {
      title : req.query.title
    }
  }).pipe(objToKeyStream()).pipe(JSONStream.stringifyObject()).pipe(res);
});

// messages

server.get("/getMessages", function(req, res) {
  bus.messages({
    name: "load",
    multi: true,
    query: {
      threadId : req.query.threadId
    }
  }).pipe(JSONStream.stringify()).pipe(res);
});

server.get("/addMessage", function(req, res) {
  bus.messages({
    name: "insert",
    data: {
      threadId : req.query.threadId,
      text     : req.query.text
    }
  }).pipe(objToKeyStream()).pipe(JSONStream.stringifyObject()).pipe(res);
});

server.get("/getMessageUser", function(req, res) {
  bus.messages({
    name: "load",
    query: {
      id: req.mesageId
    },
    join: {
      user: function(data) {
        return bus.users({
          name: "load",
          query: { id: data.userId }
        });
      }
    }
  }).pipe(JSONStream.stringifyObject()).pipe(res);
});

var port = process.env.PORT || 8080;

console.log("listening on port %d", port);

server.listen(port);
