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

// room

server.get("/getThreads", function(req, res) {

  var m = new models.Threads({
    bus      : bus.threads
  });

  m.load(function() {
    res.send(m.toJSON());
  });
});

server.get("/addThread", function(req, res) {

  var m = new models.Thread({
    bus   : bus.threads,
    title : req.query.title
  });

  m.insert(function() {
    res.send(m.toJSON());
  });
});

// messages

server.get("/getMessages", function(req, res) {

  var m = new models.Messages({
    bus      : mesh.attach({ query: { threadId: req.query.threadId } }, bus.messages)
  });

  m.load(function() {
    console.log(m);
    res.send(m.toJSON());
  });
});

server.get("/addMessage", function(req, res) {

  var m = new models.Message({
    bus      : bus.messages,
    threadId : req.query.threadId,
    text     : req.query.text
  });

  m.insert(function() {
    res.send(m.toJSON());
  });
});

// TODO
server.get("/getMessageUser", function(req, res) {

  var m = new models.Message({
    bus: mesh.attach({
      query: {
        id: req.query.messageId
      },
      join: {
        user: function(data) {
          return bus.users({
            name: "load",
            query: { id: data.userId }
          });
        }
      }
    }, bus.messages)
  });
  
  m.load(function() {
    res.send(m.data.user);
  });
});

var port = process.env.PORT || 8080;

console.log("listening on port %d", port);

server.listen(port);
