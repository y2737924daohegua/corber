const Builder        = require('ember-cli/lib/models/builder');
const Task           = require('../../../tasks/-task');
const createGitkeep  = require('../../../utils/create-gitkeep');

module.exports = Task.extend({
  project: undefined,
  environment: undefined,
  outputPath: undefined,

  initBuilder() {
    return new Builder({
      project: this.project,
      environment: this.environment,
      outputPath: this.outputPath
    });
  },

  run() {
    let builder = this.initBuilder.apply(this);

    return builder.build().then(function() {
      return createGitkeep('ember-cordova/cordova/www/.gitkeep');
    });
  }
});
