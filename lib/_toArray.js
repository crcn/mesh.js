module.exports = function(data) {
  if (data == void 0) return [];
  return Object.prototype.toString.call(data) === "[object Array]" ? data : [data];
};
