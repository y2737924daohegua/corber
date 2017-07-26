'use strict';
/* eslint-disable max-len */

var Command         = require('./-command');
var CreateTask      = require('../tasks/create-project');

module.exports = Command.extend({
  name: 'init',
  aliases: ['i'],

  availableOptions: [
    {
      name: 'name',
      type: String
    }, {
      name: 'cordovaid',
      type: String
    }, {
      name: 'template-path',
      type: String
    }
  ],

  run: function(options, rawArgs) {
    let create = new CreateTask({
      project: this.project,
      ui: this.ui,
      cordovaId: options.cordovaId,
      name: options.name,
      templatePath: options.templatePath
    });

    return create.run();
  }
});
