var caplet = require("caplet");

module.exports = caplet.createModelClass({
  fromData: function(data) {
    console.log("DA");
    return {
      uid: data.name,
      name: data.name
    };
  }
});
