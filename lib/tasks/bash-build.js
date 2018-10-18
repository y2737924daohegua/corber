const Task             = require('./-task');
const Bash             = require('./bash');
const fsUtils          = require('../utils/fs-utils');

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

    return fsUtils.empty(this.cordovaOutputPath)
      .then(() => build.run())
      .then(() => fsUtils.copyDir(this.buildPath, this.cordovaOutputPath))
  }
});
