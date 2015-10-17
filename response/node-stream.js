var Response = require('./index');

/**
 */

function NodeStreamResponse(stream) {

  Response.call(this, (writable) => {

    if (!stream) return writable.close();

    var pump = () => {
      stream.resume();
      stream.once('data', function(data) {
        stream.pause();
        writable.write(data).then(pump);
      });
    }

    var end = () => {
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
