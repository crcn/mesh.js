
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
  child        : require("./child"),
  attach       : require("./attach"),
  run          : require("./run"),
  map          : require("./map"),
  noop         : require("./noop"),
  reduce       : require("./reduce"),
  catchError   : require("./catch"),
  wrap         : require("./wrap"),
  stream       : require("./stream"),
  open         : require("./open"),
  tailable     : require("./tailable"),
  accept       : require("./accept"),
  reject       : require("./reject"),
  limit        : require("./limit"),
  yields       : require("./yields")
};
