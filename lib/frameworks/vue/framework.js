const Framework        = require('../framework');
const BuildTask        = require('./tasks/build');
const ServeTask        = require('./tasks/serve');
const Promise          = require('rsvp').Promise;

module.exports = Framework.extend({
  name: 'vue',
  buildCommand: 'npm run build dev',
  buildPath: './dist',
  port: 8080,
  root: undefined,

  validateBuild() {
    return Promise.resolve();
  },

  build(options) {
    let build = new BuildTask({
      buildPath: this.buildPath,
      cordovaOutputPath: options.cordovaOutputPath
    });

    return build.run();
  },

  validateServe() {
    return Promise.resolve();
  },

  serve(options, serveOpts) {
    let serve = new ServeTask();
    return serve.run();
  }
});
