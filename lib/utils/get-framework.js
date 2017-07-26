//TODO - get-framework is a bad name for this util
const path          = require('path');
const get           = require('lodash').get;
const logger        = require('./logger');

module.exports = {
  _getFramework(name, root) {
    let Framework;
    try {
      Framework = require(path.join(root, 'ember-cordova/config/config.js'));
    } catch (err) {
      logger.warn('No ember-cordova/config.js found. Using defaults');
      Framework = require(`../frameworks/${name}/framework.js`);
    }
    return Framework;
  },

  getPackage(projectRoot) {
    return require(path.join(projectRoot, 'package.json'));
  },

  get(project) {
    let root = project.root;
    let packageJSON = this.getPackage(root);
    let devDeps = packageJSON.devDependencies;
    let deps = packageJSON.dependencies;

    let Framework;
    if (get(devDeps, '@glimmer/application')) {
      Framework = this._getFramework('glimmer', root);
      return new Framework({
        project: project,
        root: project.root,
        isGlimmer: true
      });
    }

    //not all projects use source yet
    if (get(devDeps, 'ember-resolver') || get(devDeps, 'ember-source')) {
      Framework = this._getFramework('ember', root);
      return new Framework({
        project: project,
        root: project.root
      });
    }

    if (get(deps, 'vue')) {
      Framework = this._getFramework('vue', root);
      return new Framework({
        root: project.root
      });
    }
  }
};
