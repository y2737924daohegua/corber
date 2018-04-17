const Command          = require('./-command');
const logger           = require('../utils/logger');
const packageJSON      = require('../../package.json');

module.exports = Command.extend({
  name: 'version',
  aliases: ['-v', '--version'],
  description: 'Prints the current version of Corber',
  works: 'insideProject',

  run(options) {
    this._super.apply(this, arguments);
    logger.info(`v${packageJSON.version}`);
  }
});
