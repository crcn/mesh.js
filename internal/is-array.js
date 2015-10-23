module.exports = function(target) {
  return Object.prototype.toString.call(target) === "[object Array]";
};
