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
      query: { userId: operation.query.id },
      method: "UPDATE"
    };
  },

  { name: "load", collection: "users", multi: true }, function(operation) {
    return {
      path: "/getUsers",
      data: {},
      query: { threadId: operation.query.threadId },
      method: "POST"
    };
  },

  { name: "load", collection: "users" }, function(operation) {
    return {
      path: "/login",
      data: {},
      query: { userId: operation.query.id },
      method: "POST"
    };
  },

 /**
  * threads
  */

 { name: "load", collection: "threads", multi: true }, function(operation) {
   return {
     path: "/getThreads",
     method: "GET"
   };
 },

 { name: "insert", collection: "threads" }, function(operation) {
   return {
     path: "/addThread",
     data: {
       title: operation.data.title
     },
     method: "POST"
   };
 },

 /**
  */

  { name: "load", collection: "messages", multi: true }, function(operation) {
    return {
      path: "/getMessages",
      query: {
        threadId: operation.query.threadId
      },
      method: "GET"
    };
  },

  { name: "insert", collection: "messages" }, function(operation) {
    return {
      path: "/addMessage",
      data: {
        threadId: operation.data.threadId,
        text: operation.data.text
      },
      method: "POST"
    };
  }

];
