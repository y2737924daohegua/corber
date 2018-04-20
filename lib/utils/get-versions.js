const path       = require('path');
const getPackage = require('./get-package');
const existsSync = require('./fs-utils').existsSync;

module.exports = function getVersions(root) {
  let versions = {
    corber: {},
    node: process.versions.node
  }

  let globalPackagePath = path.join('..', '..', 'package.json');
  let globalPackage = getPackage(globalPackagePath);

  versions.corber.global = globalPackage.version;

  if (root) {
    let projectPackagePath = path.join(root, 'package.json');

    if (existsSync(projectPackagePath)) {
      let projectPackage = getPackage(projectPackagePath);

      let dependenciesVersion;
      if (projectPackage.dependencies) {
        dependenciesVersion = projectPackage.dependencies.corber;
      }

      let devDependenciesVersion;
      if (projectPackage.devDependencies) {
        devDependenciesVersion = projectPackage.devDependencies.corber;
      }

      versions.corber.project = dependenciesVersion || devDependenciesVersion;
    }
  }

  return versions;
};
