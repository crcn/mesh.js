var express    = require("express");
var mesh       = require("../..");
var memory     = require("mesh-memory");
var _          = require("highland");
var models     = require("./models");
var createBus  = require("./bus");
var JSONStream = require("JSONStream");
var stream     = require("obj-stream");
var bodyParser = require("body-parser");

// this can be swapped out for mongodb assuming you
// create another transformation step that takes id properties
// and prepends an _ character.
var db = memory();

var _id = 0;

// specific to the memory db since it doesn't support this kinda thing.
// Just add an ID whenever a new item is added to any collection
var bus = mesh.accept("insert", function(operation) {
  operation.data.id = operation.collection + (++_id);
  return db(operation);
}, db);

// setup the bus that's used on ALL clients. Except use the db (second param)
// as the main data source where data is persisted to.
bus          = createBus({}, bus);

// create an alias for the collections we wanna save to
bus.threads  = mesh.attach({ collection: "threads"  }, bus);
bus.messages = mesh.attach({ collection: "messages" }, bus);

var server = express();
server.use(bodyParser.json());

// transforms objects into a stream of data that is compatible
// with JSONStream
function objToKeyStream() {
  return stream.through(function(data, next) {
    for (var key in data) this.push([key, data[key]]);
    next();
  });
}

// Route stuff. All the models here just contain business logic. DB stuff is passed
// as bus property, so that means models / collections are isomorphic. They can run on any
// platform.
server.get("/getThreads", function(req, res) {

  var m = new models.Threads({
    bus      : bus.threads
  });

  m.load(function() {
    res.send(m.toJSON());
  });
});

server.post("/addThread", function(req, res) {

  var m = new models.Thread({
    bus   : bus.threads,
    title : req.body.title
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

server.post("/addMessage", function(req, res) {

  var m = new models.Message({
    bus      : bus.messages,
    threadId : req.body.threadId,
    text     : req.body.text
  });

  m.insert(function() {
    res.send(m.toJSON());
  });
});

var port = process.env.PORT || 8080;

console.log("listening on port %d", port);

server.listen(port);
