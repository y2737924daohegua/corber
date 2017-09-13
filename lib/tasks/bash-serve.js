const Task             = require('./-task');
const Bash             = require('./bash');

module.exports = Task.extend({
  command: undefined,
  platform: undefined,

  run() {
    let serve = new Bash({
      command: `${this.command} --CORBER_PLATFORM=${this.platform}`
    });

    return serve.run();
  }
});
