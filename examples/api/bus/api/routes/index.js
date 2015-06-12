module.exports = [

  /**
   * users
   */

  { name: "insert", collection: "users" }, function(operation) {
    return {
      path: "/register",
      data: operation.data || {},
      method: "POST"
    };
  },

  { name: "update", collection: "users" }, function(operation) {
    return {
      path: "/updateUser",
      data: operation.data || {},
      query: { userId: operation.data.id },
      method: "UPDATE"
    };
  },


]
