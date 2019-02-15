const Command          = require('./-command');
const getCordovaPath   = require('../targets/cordova/utils/get-path');
const lint             = require('../tasks/lint-index');
const path             = require('path');

module.exports = Command.extend({
  name: 'lint-index',
  description: 'Lints index.html for attributes with paths relative to root.',

  availableOptions: [{
    name: 'source',
    type: String,
    default: 'www/index.html'
  }],

  run(options = {}) {
    let cordovaPath = getCordovaPath(this.project);
    let sourcePath = path.join(cordovaPath, options.source);

    return this._super(...arguments)
      .then(() => lint(sourcePath));
  }
});
