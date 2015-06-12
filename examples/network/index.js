var readline        = require("readline");
var createServerBus = require("./bus/master");
var path            = require("path");

/**
 */

var bus = createServerBus({

  /**
   */
   
  workerPath : path.join(__dirname, "worker.js"),

  /**
   */

  port       : process.env.PORT || 1337,

  /**
   * message boundary
   */

  boundary   : "|||||",

  /**
   * number of times to retry executing an operation before returning an error
   */

  retryCount : 5
});

/**
 */

var rl = readline.createInterface({
  input  : process.stdin,
  output : process.stdout
});

/**
 */

function exec(complete, command, dist) {
  if (typeof command === "string") command = { name: command };
  if (dist) command.dist = dist;
  bus(command).on("data", function(data) {
    console.log(JSON.stringify(data, null, 2));
  }).once("error", complete).once("end", complete);
}

/**
 */

function captureOperation(error) {
  if (error) console.error(error.message);
  rl.question("", function(command) {
    try {
      new Function("exec", command)(exec.bind(void 0, captureOperation));
    } catch(e) {
      console.error(e);
      captureOperation();
    }
  });
};

captureOperation();
