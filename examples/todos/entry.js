var crud         = require("../..")
var localStorage = require("crudlet-local-storage");
var io           = require("crudlet-socket.io");
var pc           = require("paperclip");
var _            = require("highland");
var memory         = require("crudlet-memory");

var iodb = io({
  host: "http://" + location.host
});

var db = crud.tailable(localStorage());
var todosDb = crud.child(db, { collection: "todos" });

// sync remote stuff with the local db
iodb("tail").pipe(crud.open(db));

// sync local db with remote stuff
db("tail").pipe(crud.open(iodb));

// the template
var tpl = pc.template(
  "<h3>Local torage + socket.io (realtime) todos</h3>" +
  "<input type='text' placeholder='add todo' value={{<~>todoText}} onEnter={{addTodo(todoText)}} />" +
  "<ul>" +
    "<repeat each={{todos}} as='todo'>" +
      "<li><a href='#' onClick={{removeTodo(todo)}}>x</a> {{todo.text}}</li>" +
    "</repeat>" +
  "</ul>"
);

// the view controller
var view = tpl.view({
  addTodo: function(text) {
    todosDb("insert", {
      data: { text: text, uid: Date.now() }
    });

    this.todoText = "";
  },
  removeTodo: function(todo) {
    todosDb("remove", {
      query: { uid: todo.uid }
    });
  }
});

// reloads data in the view controller
function setData() {
  todosDb("load", { multi: true }).
  pipe(_.pipeline(_.collect)).
  on("data", view.set.bind(view, "todos"));
}

// wait for operations on local storage, then refresh todos
todosDb("tail").on("data", setData);

// load todos initially
setData();

document.body.appendChild(view.render());