const Emulator        = require('../emulator');

module.exports = Emulator.extend({
  apiVersion: undefined,
  uuid: undefined,
  state: undefined,

  label() {
    return `iOS ${this.apiVersion} ${this.name}`;
  }
});

