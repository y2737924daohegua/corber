const Command          = require('./-command');
const Prepare          = require('../targets/cordova/tasks/prepare');
const Hook             = require('../tasks/run-hook');
const logger           = require('../utils/logger');

module.exports = Command.extend({
  name: 'prepare',
  description: 'Runs cordova prepare',

  availableOptions: [
    { name: 'verbose', type: Boolean, default: false, aliases: ['v'] }
  ],

  run(options) {
    this._super(...arguments);

    let prepare = new Prepare({
      project: this.project
    });

    let hook = new Hook({
      project: this.project
    });

    return hook.run('beforePrepare', options)
      .then(() => prepare.run())
      .then(() => hook.run('afterPrepare', options))
      .catch((e) => {
        logger.error(e.message ? e.message : e);
        throw e;
      });
  }
});
