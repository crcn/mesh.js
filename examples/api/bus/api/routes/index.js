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
       userId: operation.data.user.id,
       title: operation.data.title
     },
     method: "POST"
   };
 },

 { name: "insert", collection: "threads" }, function(operation) {
   return {
     path: "/addMessage",
     data: operation.data || {},
     query: { userId: operation.data.user.id },
     method: "POST"
   };
 },

 /**
  */

  { name: "load", collection: "messages", multi: true }, function(operation) {
    return {
      path: "/getMessages",
      query: {
        threadId: operation.query.thread.id
      },
      method: "GET"
    };
  },

  { name: "insert", collection: "messages" }, function(operation) {
    return {
      path: "/addMessage",
      data: {
        threadId: operation.data.thread.id,
        text: operation.data.text
      },
      method: "POST"
    };
  }

]
