const Task             = require('./-task');
const Promise          = require('rsvp').Promise;

const childProcess     = require('child_process');
const defaults         = require('lodash').defaults;

const BashTask = Task.extend({
  command: undefined,
  options: undefined,

  run() {
    if (!this.options) {
      this.options = {};
    }

    let task = this;
    return new Promise(function(resolve) {
      let options = defaults(task.options, {
        maxBuffer: 5000 * 1024,
        stdio: 'inherit'
      });

      task.runCommand(task.command, options);
      resolve();
    });
  }
});

BashTask.prototype.runCommand = function(command, options) {
  childProcess.execSync(command, options);
};

module.exports = BashTask;
