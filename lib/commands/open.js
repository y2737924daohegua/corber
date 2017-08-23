const Command          = require('./-command');
const Open             = require('../targets/cordova/tasks/open-app');
const logger           = require('../utils/logger');

module.exports = Command.extend({
  name: 'open',
  aliases: [ 'o' ],
  description: 'Open the native platform project with the default or ' +
    'specified application',
  works: 'insideProject',

  availableOptions: [
    { name: 'platform', type: String, default: 'ios' },
    { name: 'application', type: String }
  ],

  run(options) {
    this._super.apply(this, arguments);

    let open = new Open({
      application: options.application,
      platform: options.platform,
      project: this.project
    });

    return open.run().catch(function(err) {
      logger.error(err);
    });
  }
});
