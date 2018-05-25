const fsUtils    = require('../../../utils/fs-utils');
const getPackage = require('../../../utils/get-package');
const path       = require('path');
const semver     = require('semver');

module.exports = function(root) {
  let emberCLIPackagePath = path.join(
    root,
    'node_modules',
    'ember-cli',
    'package.json'
  );

  if (fsUtils.existsSync(emberCLIPackagePath)) {
    let packageJSON = getPackage(emberCLIPackagePath);
    return packageJSON.version;
  }

  let packagePath = path.join(root, 'package.json');
  let packageJSON = getPackage(packagePath);
  let { dependencies, devDependencies } = packageJSON;

  if (dependencies && dependencies['ember-cli']) {
    return semver.coerce(dependencies['ember-cli']).version;
  }

  if (devDependencies && devDependencies['ember-cli']) {
    return semver.coerce(devDependencies['ember-cli']).version;
  }
};
