const Command          = require('./-command');
const Devices          = require('../targets/cordova/tasks/devices');
const logger           = require('../utils/logger');

module.exports = Command.extend({
  name: 'devices',
  aliases: ['d'],
  description: 'List Devices',

  /* eslint-disable max-len */
  availableOptions: [
  ],
  /* eslint-enable max-len */

  run(options) {
    this._super.apply(this, arguments);

    logger.info('Listing devices');

    let devices = new Devices({
      project: this.project
    });

    return devices.run();
  }
});

