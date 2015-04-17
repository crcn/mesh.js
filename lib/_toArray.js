var _isArray = require("./_isArray");

module.exports = function(data) {
  if (data == void 0) return [];
  return _isArray(data) ? data : [data];
};
