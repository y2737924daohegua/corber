const Command         = require('./-command');
const CreateProject   = require('../tasks/create-project');

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

  run(options, rawArgs) {
    let create = new CreateProject({
      project: this.project,
      ui: this.ui,
      cordovaId: options.cordovaId,
      name: options.name,
      templatePath: options.templatePath
    });

    return create.run();
  }
});
