'use strict';

var Command         = require('./-command');
var OpenAppTask     = require('../targets/cordova/tasks/open-app');
var logger          = require('../utils/logger');

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

  run: function(options) {
    this._super.apply(this, arguments);

    var open = new OpenAppTask({
      application: options.application,
      platform: options.platform,
      project: this.project
    });

    return open.run().catch(function(err) {
      logger.error(err);
    });
  }
});
