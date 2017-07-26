'use strict';

var Task            = require('../../../tasks/-task');
var CordovaRawTask  = require('./raw');

module.exports = Task.extend({
  project: undefined,

  platform: undefined,
  cordovaOpts: {},
  verbose: false,

  run: function() {
    var build = new CordovaRawTask({
      project: this.project,
      rawApi: 'build',
    });

    return build.run({
      platforms: [this.platform],
      options: this.cordovaOpts,
      verbose: this.verbose
    });
  }
});
