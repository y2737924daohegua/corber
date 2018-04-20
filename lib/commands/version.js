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

    let versions = getVersions(this.project.root);
    logger.info(`corber (global): ${versions.corber.global}`);

    if (versions.corber.project) {
      logger.info(`corber (project): ${versions.corber.project}`);
    }

    logger.info(`node: ${versions.node}`);

    return Promise.resolve();
  }
});
