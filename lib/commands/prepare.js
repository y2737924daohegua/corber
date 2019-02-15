const Command          = require('./-command');
const Prepare          = require('../targets/cordova/tasks/prepare');
const runHook          = require('../tasks/run-hook');
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

    let hookOptions = { root: this.project.root };

    return this._super(...arguments)
      .then(() => runHook('beforePrepare', options, hookOptions))
      .then(() => prepare.run())
      .then(() => runHook('afterPrepare', options, hookOptions))
      .catch((e) => {
        logger.error(e.message ? e.message : e);
        throw e;
      });
  }
});
