var CreateTask = require('../../lib/tasks/create-project');

module.exports = {
  name: 'ember-cordova',

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

  fileMapTokens: function() {
    return {
      __root__: function() { return '/'; }
    };
  },

  normalizeEntityName: function() {
    // h/t mirage
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall: function(options) {
    let create = new CreateTask({
      project: this.project,
      ui: this.ui,
      cordovaId: options.cordovaId,
      name: options.name,
      templatePath: options.templatePath
    });

    return create.run();
  }
};
