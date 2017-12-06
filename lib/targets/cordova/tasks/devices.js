const Task            = require('../../../tasks/-task');
const CordovaRaw      = require('./raw');

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
