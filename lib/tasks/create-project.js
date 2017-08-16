const Task             = require('./-task');
const CreateCordova    = require('../targets/cordova/tasks/create-project');
const UpdateGitIgnore  = require('../tasks/update-gitignore');
const camelize         = require('../utils/string').camelize;
const path             = require('path');
const Promise          = require('rsvp').Promise;
const fsUtils          = require('../utils/fs-utils');
const frameworkType    = require('../utils/framework-type');
const requireFramework = require('../utils/require-framework');

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
    let configPath = path.join(
      __dirname,
      '../templates/frameworks',
      `${framework}.js`
    );

    fsUtils.mkdir(emberCdvPath);
    fsUtils.mkdir(path.join(emberCdvPath, 'config'));

    fsUtils.copy(
      configPath,
      path.resolve(emberCdvPath, 'config/framework.js')
    );

    return Promise.resolve();
  },

  run() {
    let projectName = camelize(this.project.name());

    let create = new CreateCordova({
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

    return this.initDirs(this.project)
    .then(() => create.run())
    .then(() => updateGitIgnore.run())
    .then(() => {
      let framework = requireFramework(this.project);
      framework.afterInstall();
    })
  }
});
