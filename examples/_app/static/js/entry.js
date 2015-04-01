var Application = require("./application");
var app = global.app = new Application();
app.render({
  element: document.body
});
