
/**
 */

module.exports = {
  parallel     : require("./parallel"),
  sequence     : require("./sequence"),
  first        : require("./fallback"),
  fallback     : require("./fallback"),
  race         : require("./race"),
  operation    : require("./operation"),
  op           : require("./operation"),
  delta        : require("./delta"),
  child        : require("./child"),
  attach       : require("./attach"),
  stream       : require("./open"),
  run          : require("./run"),
  reduce       : require("./reduce"),
  map          : require("./map"),
  wrapCallback : require("./wrapCallback"),
  wrap         : require("./wrapCallback"),
  open         : require("./open"),
  tailable     : require("./tailable"),
  accept       : require("./accept"),
  reject       : require("./reject"),
  clean        : require("./top"),
  top          : require("./top"),
  limit        : require("./limit")
};
