const Command          = require('./-command');
const Prepare          = require('../targets/cordova/tasks/prepare');
const Hook             = require('../tasks/run-hook');
const logger           = require('../utils/logger');

module.exports = Command.extend({
  name: 'prepare',
  description: 'Runs cordova prepare and ember cdv link',
  works: 'insideProject',

  availableOptions: [
    { name: 'verbose', type: Boolean, default: false, aliases: ['v'] }
  ],

  run(options) {
    this._super.apply(this, arguments);

    let prepare = new Prepare({
      project: this.project,
      verbose: options.verbose
    });

    let hook = new Hook({
      project: this.project
    });

    return hook.run('beforePrepare', options)
      .then(prepare.prepare())
      .then(hook.prepare('afterPrepare', options))
      .catch(function(err) {
        logger.error(err);
      });
  }
});
