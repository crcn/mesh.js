var createBus = require("./bus");
var models    = require("./models");
var mesh      = require("../..");

var bus = createBus({
  prefix: "http://127.0.0.1:8080"
});

// "spy" is a command executed by collections. Basically a fancier "tail" method
bus = mesh.reject("spy", mesh.limit(1, bus), bus);

// create a new thread
var thread = new models.Thread({
  bus: mesh.attach({ collection: "threads" }, bus)
});

// this should run POST /addThread
thread.save(function() {

  // we can add messages here in a synchronous fashion since we
  // set the limit above to 1
  thread.addMessage("hello world");
  thread.addMessage("mmmm donuts");
  thread.addMessage("how much wood could a wood chuck chuck?");
  thread.addMessage("there are 160,934.4 cm in a mile");

  // this will get executed after all messages are persisted and
  // stored in the server db
  thread.getMessages(function(err, messages) {
    console.log(messages.toJSON());
  });
});
