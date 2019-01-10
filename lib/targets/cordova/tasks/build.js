const Task            = require('../../../tasks/-task');
const CordovaRaw      = require('./raw');

module.exports = Task.extend({
  project: undefined,

  platform: undefined,
  cordovaOpts: {},
  browserify: false,

  run() {
    let build = new CordovaRaw({
      project: this.project,
      api: 'build',
    });

    return build.run({
      platforms: [this.platform],
      options: this.cordovaOpts,
      browserify: this.browserify,
      emulator: true
    });
  }
});
