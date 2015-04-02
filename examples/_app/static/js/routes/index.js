var hasher = require("hasher");

module.exports = function(app) {
  //handle hash changes
  function handleChanges(newHash, oldHash){
    app.set("currentExampleUID", newHash);
  }

  hasher.changed.add(handleChanges);
  hasher.initialized.add(handleChanges);
  hasher.init();
}
