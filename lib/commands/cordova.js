'use strict';
/* eslint-disable max-len */

var Command         = require('./-command');
var logger          = require('../utils/logger');

module.exports = Command.extend({
  name: 'cordova',
  aliases: ['cdv'],
  description: 'Deprecated',

  run: function(options, rawArgs) {
    this._super.apply(this, arguments);

    logger.warn(
      '(DEPRECATION) The Cordova proxy command\n' +
      '\tcorber cdv <command>\n' +
      'has been deprecated in favour of\n' +
      '\tcorber proxy <command>\n' +
      'For example, "corber cdv run" is now "corber proxy run".'
    );
  }
});
