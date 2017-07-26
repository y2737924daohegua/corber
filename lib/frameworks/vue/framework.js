const Framework        = require('../framework');
const ServeTask        = require('./tasks/serve');
const RSVP             = require('rsvp');
const Promise          = RSVP.Promise;
const BashTask         = require('../../tasks/bash');
const logger           = require('../../utils/logger');

module.exports = Framework.extend({
  name: 'vue',
  buildCommand: 'npm run build dev',
  buildPath: './dist',
  port: 8080,
  root: undefined,

  validateBuild() {
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
      return copy.run();
    });
  },

  validateServe() {
    return Promise.resolve();
  },

  serve(project, options, serveOpts) {
    let serve = new ServeTask();
    return serve.run();
  }
});
