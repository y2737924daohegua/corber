const Task             = require('../../../tasks/-task');
const Bash             = require('../../../tasks/bash');
const AddCordovaJS     = require('../../../tasks/add-cordova-js');
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

    let copy = new Bash({
      command: `cp -R ${this.buildPath}/* ${this.cordovaOutputPath}`
    });

    let addCordovaJS = new AddCordovaJS({
      source: path.join(this.cordovaOutputPath, 'index.html')
    });

    return build.run()
      .then(copy.prepare())
      .then(addCordovaJS.prepare())
  }
});
