const CoreObject       = require('core-object');

module.exports = CoreObject.extend({
  id: undefined,
  uuid: undefined,
  name: undefined,
  platform: undefined,
  deviceType: undefined,
  state: undefined,

  label() {
    return `${this.platform} ${this.deviceType} - ${this.name} ${this.apiVersion}`;
  }
});
