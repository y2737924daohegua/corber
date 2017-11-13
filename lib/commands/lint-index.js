const Command          = require('./-command');
const Lint             = require('../tasks/lint-index');

module.exports = Command.extend({
  name: 'lint-index',
  description: 'Lints index.html for attributes with paths relative to root.',
  works: 'insideProject',

  availableOptions: [{
    name: 'source',
    type: String,
    default: 'www/index.html'
  }],

  run(options) {
    this._super.apply(this, arguments);

    let lint = new Lint({
      source: options.source,
      project: this.project
    });

    return lint.run();
  }
});
