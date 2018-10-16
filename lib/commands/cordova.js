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
      'DEPRECATION WARNING (corber): corber cdv proxy syntax has been deprecated in favor of corber proxy\n' +
      'The prior proxy command was "corber cdv $COMMAND" \n' +
      'To ease confusion this is now "cordova proxy $COMMAND". No other changes are required. \n' +
      'So corber cdv run would now be corber proxy run \n'
    );
  }
});
