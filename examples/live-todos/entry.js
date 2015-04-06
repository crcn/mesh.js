var mesh         = require("../..")
var localStorage = require("mesh-local-storage");
var io           = require("mesh-socket.io");
var pc           = require("paperclip");
var _            = require("highland");
var memory         = require("mesh-memory");

var iodb = io({
  host: "http://" + location.host,
  channel: "live-todos"
});

var db = mesh.tailable(localStorage({
  storageKey: "mesh"
}));

var todosDb = mesh.child(db, { collection: "todos" });

// sync remote stuff with the local db
iodb(mesh.op("tail")).pipe(mesh.open(db));

// sync local db with remote stuff
db(mesh.op("tail")).pipe(mesh.open(iodb));

// the template
var tpl = pc.template(
  "<h3>Local storage + socket.io (realtime) todos</h3>" +
  "<input type='text' class='form-control' placeholder='add todo' value={{<~>todoText}} onEnter={{addTodo(todoText)}} />" +
  "<ul class='todo-items'>" +
    "<repeat each={{todos}} as='todo'>" +
      "<li><a href='#' onClick={{removeTodo(todo)}}>x</a> {{todo.text}}</li>" +
    "</repeat>" +
  "</ul>"
);

// the view controller
var view = tpl.view({
  addTodo: function(text) {
    todosDb(mesh.op("insert", {
      data: { text: text, uid: Date.now() }
    }));

    this.todoText = "";
  },
  removeTodo: function(todo) {
    todosDb(mesh.op("remove", {
      query: { uid: todo.uid }
    }));
  }
});

// reloads data in the view controller
function setData() {
  todosDb(mesh.op("load", { multi: true })).
  pipe(_.pipeline(_.collect)).
  on("data", view.set.bind(view, "todos"));
}

// wait for operations on local storage, then refresh todos
db(mesh.op("tail")).on("data", setData);

// load todos initially
setData();

document.body.appendChild(view.render());
