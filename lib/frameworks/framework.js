const CoreObject       = require('core-object');
const Promise          = require('rsvp').Promise;

module.exports = CoreObject.extend({
  afterInstall() {
    return Promise.resolve();
  }
});
