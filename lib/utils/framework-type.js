const some              = require('lodash').some;
const get              = require('lodash').get;
const path             = require('path');
const getPackage       = require('./get-package');

const frameworkPackages = {
  glimmer: ['@glimmer/application'],
  ember: ['ember-resolver', 'ember-source'],
  vue: ['vue'],
  react: ['react']
};

module.exports = {
  detectAll(root) {
    let packagePath = path.join(root, 'package.json');
    let packageJSON = getPackage(packagePath);
    let devDeps = packageJSON.devDependencies;
    let deps = packageJSON.dependencies;

    let frameworks = Object.keys(frameworkPackages).filter((framework) => {
      return some(frameworkPackages[framework], (pkg) => {
        return get(deps, pkg) || get(devDeps, pkg);
      });
    });

    if (frameworks.length === 0) {
      return ['custom'];
    }

    return frameworks;
  },

  get(root) {
    return this.detectAll(root)[0];
  }
};
