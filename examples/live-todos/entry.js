var crud         = require("../..")
var localStorage = require("crudlet-local-storage");
var io           = require("crudlet-socket.io");
var pc           = require("paperclip");
var _            = require("highland");
var memory         = require("crudlet-memory");

var iodb = io({
  host: "http://" + location.host,
  channel: "todos"
});

var db = crud.tailable(localStorage());
var todosDb = crud.child(db, { collection: "todos" });

// sync remote stuff with the local db
iodb(crud.op("tail")).pipe(crud.open(db));

// sync local db with remote stuff
db(crud.op("tail")).pipe(crud.open(iodb));

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
    todosDb(crud.op("insert", {
      data: { text: text, uid: Date.now() }
    }));

    this.todoText = "";
  },
  removeTodo: function(todo) {
    todosDb(crud.op("remove", {
      query: { uid: todo.uid }
    }));
  }
});

// reloads data in the view controller
function setData() {
  todosDb(crud.op("load", { multi: true })).
  pipe(_.pipeline(_.collect)).
  on("data", view.set.bind(view, "todos"));
}

// wait for operations on local storage, then refresh todos
db(crud.op("tail")).on("data", setData);

// load todos initially
setData();

document.body.appendChild(view.render());
