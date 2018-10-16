const path       = require('path');
const getPackage = require('./get-package');
const existsSync = require('./fs-utils').existsSync;

module.exports = function getVersions(root) {
  let versions = {};
  let globalPackagePath = path.resolve(__dirname, '..', '..', 'package.json');

  if (existsSync(globalPackagePath)) {
    versions.global = getPackage(globalPackagePath).version;
  }

  versions.project = {};

  if (root) {
    let projectPackagePath = path.join(root, 'package.json');

    if (existsSync(projectPackagePath)) {
      let { dependencies, devDependencies } = getPackage(projectPackagePath);

      if (devDependencies && devDependencies.corber) {
        versions.project.required = devDependencies.corber
      } else if (dependencies && dependencies.corber) {
        versions.project.required = dependencies.corber;
      }

      let corberPackagePath = path.join(
        root,
        'node_modules',
        'corber',
        'package.json'
      );

      if (existsSync(corberPackagePath)) {
        versions.project.installed = getPackage(corberPackagePath).version;
      }
    }
  }

  return {
    corber: versions,
    node: process.versions.node
  };
};
