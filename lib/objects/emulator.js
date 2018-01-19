const CoreObject       = require('core-object');

module.exports = CoreObject.extend({
  id: undefined,
  platform: undefined,
  name: undefined,

  label() {
    return `${this.platform} - ${this.name}`;
  }
});
