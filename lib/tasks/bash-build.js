const Task             = require('./-task');
const Bash             = require('./bash');
const fsUtils          = require('../utils/fs-utils');
const createGitkeep    = require('../utils/create-gitkeep');
const path             = require('path');

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

    let gitkeepPath = path.join(this.cordovaOutputPath, '.gitkeep');

    return fsUtils.empty(this.cordovaOutputPath)
      .then(() => createGitkeep(gitkeepPath))
      .then(() => build.run())
      .then(() => fsUtils.copyDir(this.buildPath, this.cordovaOutputPath))
  }
});
