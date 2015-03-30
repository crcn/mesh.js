var crudlet     = require("../..");
var caplet      = require("caplet");
var localstore  = require("crudlet-local-storage");
var pubnub      = require("crudlet-pubnub");
var React       = require("react");

var localdb = localstore();
var pubdb   = pubnub({
  publish_key: "pub-c-ca2119a6-a6a6-4374-8020-c94f5e439d77",
  subscribe_key: "sub-c-5bbdee5e-d560-11e4-b585-0619f8945a4f"
});

pubdb.addChannel("chatroom");

var db      = crudlet.tailable(crudlet.parallel(localdb, pubdb));
crudlet.run(pubdb, "tail").on("data", function(operation) {
  console.log(operation);
}).pipe(crudlet.open(db));

var messagesDb = crudlet.child(db, { collection: "messages" });

/**
 */

var Message = caplet.createModelClass({
  initialize: function() {
    this.opStream = crudlet.open(messagesDb).on("data", this.set.bind(this, "data"));
  },
  remove: function() {
    this.opStream.
    write(crudlet.operation("remove", { query: { uid: this.uid } }));
    this.dispose();
  },
  save: function() {
    this.opStream.
    write(crudlet.operation(this.uid ? "update" : "insert", { query: { uid: this.uid }, data: this }));
  },
  toData: function() {
    return {
      uid  : this.uid || String(Date.now()) + "_" + Math.round(Math.random() * 999999999),
      text : this.text
    };
  }
});

/**
 */

var Messages = caplet.createCollectionClass({
  modelClass: Message,
  initialize: function() {
    crudlet.open(messagesDb).
    on("data", this.load.bind(this)).
    write(crudlet.operation("tail"));
  },
  load: function() {
    crudlet.open(messagesDb).
    on("data", this.set.bind(this, "data")).
    on("data", function(data) {
      console.log(data);
    }).
    end(crudlet.operation("load", { multi: true }));
    return this;
  }
});

/**
 */

var MessageView = React.createClass({
  mixins: [caplet.watchModelsMixin],
  removeMessage: function() {
    this.props.message.remove();
  },
  render: function() {
    return React.createElement("li", null, 
      this.props.message.uid,
      this.props.message.text,
      " ",
      React.createElement("a", { href: "#", onClick: this.removeMessage}, "x")
    );
  }
});

/**
 */

var MessagesView = React.createClass({
  mixins: [caplet.watchModelsMixin],
  onKeyDown: function(event) {
    if (event.keyCode !== 13) return;
    var input = this.refs.input.getDOMNode();
    this.props.messages.create({ 
      text: input.value
    }).save();
    input.value = "";
  },
  render: function() {
    return React.createElement("div", null, 
      React.createElement("input", { ref: "input", placeholder: "Message", onKeyDown: this.onKeyDown }),
      React.createElement("ul", null, 
        this.props.messages.map(function(message) {
          return React.createElement(MessageView, { message: message })
        })
      )
    )
  }
});

/**
 */

React.render(React.createElement(MessagesView, {
  messages: global.messages = Messages().load()
}), document.body);