const Builder          = require('ember-cli/lib/models/builder');
const Task             = require('../../../tasks/-task');
const createGitkeep    = require('../../../utils/create-gitkeep');
const willInterruptProcess  = require('../../../../node_modules/ember-cli/lib/utilities/will-interrupt-process');

module.exports = Task.extend({
  project: undefined,
  environment: undefined,
  outputPath: undefined,

  initBuilder() {
    return new Builder({
      project: this.project,
      environment: this.environment,
      outputPath: this.outputPath,
      onProcessInterrupt: willInterruptProcess
    });
  },

  run() {
    let builder = this.initBuilder.apply(this);

    return builder.build().then(function() {
      return createGitkeep('corber/cordova/www/.gitkeep');
    });
  }
});
