var Response = require('./index');

/**
 */

function NodeStreamResponse(stream) {

  Response.call(this, function createWritable(writable) {

    if (!stream) return writable.close();

    function pump() {
      stream.resume();
      stream.once('data', function(data) {
        stream.pause();
        writable.write(data).then(pump);
      });
    }

    function end() {
      writable.close();
    }

    stream
    .once('end', end)
    .once('error', writable.abort.bind(writable));

    pump();
  });
}

/**
 */

Response.extend(NodeStreamResponse);

/**
 */

module.exports =  NodeStreamResponse;
