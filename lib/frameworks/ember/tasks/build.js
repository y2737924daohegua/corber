const Builder          = require('ember-cli/lib/models/builder');
const Task             = require('../../../tasks/-task');
const createGitkeep    = require('../../../utils/create-gitkeep');
const logger           = require('../../../utils/logger');

/* eslint-disable max-len */
const willInterruptProcess  = require('ember-cli/lib/utilities/will-interrupt-process');
try {
  willInterruptProcess.capture(process);
} catch (e) {
  logger.warn('corber: trying to capture ember build, but already captured');
}
/* eslint-enable max-len */

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
