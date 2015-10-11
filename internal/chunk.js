/**
 */

function Chunk(value, done) {
  this.value = value;
  this.done  = done === true;
}

/**
 */

module.exports = Chunk;
