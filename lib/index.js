
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
  run          : require("./run"),
  map          : require("./map"),
  noop         : require("./noop"),
  reduce       : require("./reduce"),
  catchError   : require("./catch"), // change to catchError
  "catch"      : require("./catch"), // change to catchError
  wrapCallback : require("./wrap"),
  wrap         : require("./wrap"),
  stream       : require("./stream"),
  open         : require("./open"),
  tailable     : require("./tailable"),
  accept       : require("./accept"),
  reject       : require("./reject"),
  clean        : require("./top"),
  top          : require("./top"),
  limit        : require("./limit"),
  yields       : require("./yields")
};
