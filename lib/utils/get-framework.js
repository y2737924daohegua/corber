const path          = require('path');
const get           = require('lodash').get;

module.exports = {
  getPackage(projectRoot) {
    return require(path.join(projectRoot, 'package.json'));
  },

  get(project) {
    let packageJSON = this.getPackage(project.root);
    let devDeps = packageJSON.devDependencies;
    let deps = packageJSON.dependencies;

    let Framework;

    if (get(devDeps, '@glimmer/application')) {
      Framework = require('../frameworks/glimmer');
      return new Framework({
        project: project,
        isGlimmer: true
      });
    }

    //not all projects use source yet
    if (get(devDeps, 'ember-resolver') || get(devDeps, 'ember-source')) {
      Framework = require('../frameworks/ember');
      return new Framework({
        project: project
      });
    }

    if (get(deps, 'vue')) {
      Framework = require('../frameworks/vue');
      return new Framework();
    }
  }
};
