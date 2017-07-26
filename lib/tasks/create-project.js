const Task                = require('./-task');
const CreateCordovaTask   = require('../targets/cordova/tasks/create-project');
const UpdateGitIgnore     = require('../tasks/update-gitignore');
//TODO - move to ember-framework
const UpdateWatchmanIgnore = require('../tasks/update-watchman-config');
const camelize            = require('../utils/string').camelize;
const path                = require('path');
const fsUtils             = require('../utils/fs-utils');
const getFramework        = require('../utils/get-framework');

const createProjectId = function(projectName) {
  return 'com.embercordova.' + projectName;
};

module.exports = Task.extend({
  project: undefined,
  ui: undefined,
  cordovaId: undefined,
  name: undefined,
  templatePath: '',

  initDirs(project) {
    let framework = getFramework.get(project);
    let emberCdvPath = path.join(project.root, 'ember-cordova');

    fsUtils.mkdir(emberCdvPath);
    fsUtils.mkdir(path.join(emberCdvPath, 'config'));

    return fsUtils.copy(
      path.resolve(`node_modules/ember-cordova/lib/templates/framework-config/${framework.name}.js`),
      path.resolve(emberCdvPath, 'config/config.js')
    );
  },

  run() {
    this.initDirs(this.project);

    let projectName = camelize(this.project.name());

    let create = new CreateCordovaTask({
      id: this.cordovaid || createProjectId(projectName),
      name: this.name || projectName,
      templatePath: this.templatePath,
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

    return create.run()
    .then(updateGitIgnore.prepare())
    .then(updateWatchmanIgnore.prepare());
  }
});
