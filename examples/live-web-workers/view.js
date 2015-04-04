var pc   = require("paperclip");
var crud = require("../..");
var _    = require("highland");

module.exports = function(app, element) {

  var todosDb = crud.child(app.db, { collection: "todos" });

  // the template
  var tpl = pc.template(
    "<h3>Web worker todos</h3>" +
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
  function update() {
    todosDb(crud.op("load", { multi: true })).
    pipe(_.pipeline(_.collect)).
    on("data", view.set.bind(view, "todos"));
  }

  // wait for operations on local storage, then refresh todos
  todosDb(crud.op("tail")).on("data", update);

  // load todos initially
  update();

  document.body.appendChild(view.render());
}
