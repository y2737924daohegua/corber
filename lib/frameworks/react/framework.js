const Framework        = require('../framework');
const Build            = require('./tasks/build');
const Serve            = require('./tasks/serve');

const Promise = require('rsvp').Promise;

module.exports = Framework.extend({
  name: 'react',
  buildCommand: 'npm run build',
  buildPath: './build',
  port: 3000,
  root: undefined,

  validateBuild(options) {
    return Promise.resolve();
  },

  build(options) {
    let build = new Build({
      buildCommand: this.buildCommand,
      buildPath: this.buildPath,
      cordovaOutputPath: options.cordovaOutputPath
    });

    return build.run();
  },

  validateServe(options) {
    return Promise.resolve();
  },

  serve(options, serveOpts) {
    let serve = new Serve();
    return serve.run(options.platform);
  }
});
