const Task             = require('../../../tasks/-task');
const Bash             = require('../../../tasks/bash');

module.exports = Task.extend({
  buildCommand: undefined,
  buildPath: undefined,
  cordovaOutputPath: undefined,

  run() {
    let build = new Bash({
      command: this.buildCommand,
      options: {
        //TODO - needs to alwyas be project root
        cwd: process.cwd()
      }
    });

    let copy = new Bash({
      command: `cp -R ${this.buildPath}/* ${this.cordovaOutputPath}`
    });

    return build.run().then(() => copy.run());
  }
});
