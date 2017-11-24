const path            = require('path');
const Promise         = require('rsvp').Promise;

module.exports = {
  env: 'development',
  id: 'corber-mock',
  name: 'corber-mock',

  project: {
    root: path.resolve(__dirname, '..', '..', 'fixtures', 'corber-mock'),
    name() { return 'corber-mock' },
    isEmberCLIProject() { return true; },
    config() {
      return {}
    }
  },

  config() {},

  ui: {
    prompt() { return Promise.resolve(); }
  }
}
