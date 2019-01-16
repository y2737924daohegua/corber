const Command          = require('./-command');
const Open             = require('../targets/cordova/tasks/open-app');
const logger           = require('../utils/logger');
const Promise          = require('rsvp').Promise;

module.exports = Command.extend({
  name: 'open',
  aliases: [ 'o' ],
  description: 'Open the native platform project with the default or ' +
    'specified application',

  availableOptions: [
    { name: 'platform', type: String, default: 'ios' },
    { name: 'application', type: String }
  ],

  run(options) {
    this._super(...arguments);

    logger.success(`Opening app for ${options.platform}`);

    let open = new Open({
      application: options.application,
      platform: options.platform,
      project: this.project
    });

    return new Promise((resolve, reject) => {
      open.run().then(resolve).catch((err) => {
        logger.error(err);
        reject(err);
      });
    });
  }
});
