const CoreObject       = require('core-object');

module.exports = CoreObject.extend({
  id: undefined,
  uuid: undefined,
  name: undefined,
  platform: undefined,
  deviceType: undefined,
  state: undefined,

  label() {
    let display = `${this.platform} ${this.deviceType} - ${this.name}`;
    if (this.apiVersion) {
      display += ` API: ${this.apiVersion}`
    }

    return display;
  }
});
