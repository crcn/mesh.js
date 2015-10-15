
/**
 */

function Chunk(value, done) {
  this.value = value;
  this.done  = !!done;
}

/**
 */

module.exports = Chunk;
