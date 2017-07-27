const Task                = require('./-task');
const CreateCordovaTask   = require('../targets/cordova/tasks/create-project');
const UpdateGitIgnore     = require('../tasks/update-gitignore');
//TODO - move to ember-framework
const UpdateWatchmanIgnore = require('../tasks/update-watchman-config');
const camelize            = require('../utils/string').camelize;
const path                = require('path');
const fsUtils             = require('../utils/fs-utils');
const frameworkType       = require('../utils/framework-type');

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
    let emberCdvPath = path.join(project.root, 'ember-cordova');
    let framework = frameworkType.get(project.root);
    let configPath = path.join(__dirname, '../templates/framework-config', `${framework}.js`);

    fsUtils.mkdir(emberCdvPath);
    fsUtils.mkdir(path.join(emberCdvPath, 'config'));

    return fsUtils.copy(
      configPath,
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
