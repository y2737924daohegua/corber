const Command          = require('./-command');
const Prepare          = require('../targets/cordova/tasks/prepare');
const Hook             = require('../tasks/run-hook');
const logger           = require('../utils/logger');
const Promise          = require('rsvp').Promise;

module.exports = Command.extend({
  name: 'prepare',
  description: 'Runs cordova prepare',

  availableOptions: [
    { name: 'verbose', type: Boolean, default: false, aliases: ['v'] }
  ],

  run(options) {
    this._super.apply(this, arguments);

    let prepare = new Prepare({
      project: this.project
    });

    let hook = new Hook({
      project: this.project
    });

    return new Promise((resolve, reject) => {
      hook.run('beforePrepare', options)
        .then(() => prepare.run())
        .then(() => hook.run('afterPrepare', options))
        .then(resolve)
        .catch(function(err) {
          logger.error(err);
          reject(err);
        });
    })
  }
});
