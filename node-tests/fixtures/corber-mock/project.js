'use strict';

var path            = require('path');

module.exports = {
  env: 'development',
  id: 'corber-mock',
  name: 'corber-mock',

  project: {
    root: path.resolve(__dirname, '..', '..', 'fixtures', 'corber-mock'),
    name: function() { return 'corber-mock' },
    isEmberCLIProject: function() { return true; },
    config: function() {
      return {}
    }
  },

  config: function() {}
}
