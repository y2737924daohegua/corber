const Command          = require('./-command');
const logger           = require('../utils/logger');
const getVersions      = require('../utils/get-versions');
const Promise          = require('rsvp').Promise;

module.exports = Command.extend({
  name: 'version',
  aliases: ['v', '-v', '--version'],
  description: 'Prints the current version of Corber',
  scope: 'everywhere',

  run(options) {
    this._super.apply(this, arguments);

    let {
      corber: {
        global,
        project: {
          required,
          installed
        }
      },
      node
    } = getVersions(this.project.root);

    if (global) {
      logger.info(`corber (global): ${global}`);
    }

    if (required) {
      logger.info(`corber (package.json): ${required}`);
    }

    if (installed) {
      logger.info(`corber (node_modules): ${installed}`);
    }

    logger.info(`node: ${node}`);

    return Promise.resolve();
  }
});
