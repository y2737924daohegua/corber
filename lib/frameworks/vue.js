const CoreObject = require('core-object');
const Promise = require('rsvp').Promise;
const BashTask        = require('../tasks/bash');
const logger          = require('../utils/logger');

module.exports = CoreObject.extend({
  buildCommand: 'npm run build dev',
  buildPath: './dist',

  validate() {
    return Promise.resolve();
  },

  build(project, options) {
    let build = new BashTask({
      command: this.buildCommand,
      options: {
        //TODO - needs to alwyas be project root
        cwd: process.cwd()
      }
    });

    let copy = new BashTask({
      command: `cp -R ${this.buildPath}/* ${options.cordovaOutputPath}`
    });

    return build.run().then(() => {
      return copy.run()
    });
  }
});
