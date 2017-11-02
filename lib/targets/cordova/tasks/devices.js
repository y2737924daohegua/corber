const Task            = require('../../../tasks/-task');
const CordovaRaw      = require('./raw');
const logger          = require('../../../utils/logger');

module.exports = Task.extend({
  project: undefined,
  verbose: false,

  run() {
    let devices = new CordovaRaw({
      project: this.project,
      api: 'targets',
    });

    return devices.run();
  }
});
