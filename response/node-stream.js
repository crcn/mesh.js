var Response = require('./index');

/**
 */

function NodeStreamResponse(stream) {

  Response.call(this, (writable) => {

    if (!stream) return writable.end();

    var pump = () => {
      stream.resume();
      stream.once('data', function(data) {
        stream.pause();
        writable.write(data).then(pump);
      });
    }

    var end = () => {
      writable.end();
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
