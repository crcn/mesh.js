var spawn = require('child_process').spawn;

module.exports = function(command, args, options) {
  return new Promise(function(resolve, reject) {
    var proc = spawn(command, args, options);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on('close', function(code) {
      if (code === 0) resolve(code); else reject();
    });
  })
}