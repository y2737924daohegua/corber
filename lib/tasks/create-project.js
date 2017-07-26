const Task                = require('./-task');
const CreateCordovaTask   = require('../targets/cordova/tasks/create-project');
const UpdateGitIgnore     = require('../tasks/update-gitignore');
//TODO - move to ember-framework
const UpdateWatchmanIgnore = require('../tasks/update-watchman-config');
const camelize            = require('../utils/string').camelize;

const createProjectId = function(projectName) {
  return 'com.embercordova.' + projectName;
};

module.exports = Task.extend({
  project: undefined,
  ui: undefined,
  cordovaId: undefined,
  name: undefined,
  templatePath: '',

  run() {
    let projectName = camelize(this.project.name());

    let create = new CreateCordovaTask({
      id: this.cordovaid || createProjectId(projectName),
      name: this.name || projectName,
      project: this.project,
      ui: this.ui
    });

    let updateGitIgnore = new UpdateGitIgnore({
      project: this.project,
      ui: this.ui
    });

    let updateWatchmanIgnore = new UpdateWatchmanIgnore({
      project: this.project,
      ui: this.ui
    });

    return create.run(this.templatePath)
    .then(updateGitIgnore.prepare())
    .then(updateWatchmanIgnore.prepare());
  }
});
