module.exports = function(data) {
  return Object.prototype.toString.call(data) === "[object Array]";
};
