module.exports = [

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
