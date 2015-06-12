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

  { name: "load", collection: "users" }, function(operation) {
    return {
      path: "/login",
      data: operation.data || {},
      query: { userId: operation.data.id },
      method: "POST"
    };
  },

  /**
   * messages
   */

   { name: "load", collection: "messages", multi: true }, function(operation) {
     return {
       path: "/getMessages",
       data: operation.data || {},
       query: { userId: operation.data.user.id },
       method: "GET"
     };
   }
]
