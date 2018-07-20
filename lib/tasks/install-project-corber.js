const Task            = require('./-task');
const InstallPackage  = require('./install-package');
const logger          = require('../utils/logger');

module.exports = Task.extend({
  rootPath: undefined,

  run() {
    logger.info('Adding corber to devDependencies');

    let corberVersion = require('../../package.json').version;
    let install = new InstallPackage({
      rootPath: this.rootPath
    });

    return install.run('corber', corberVersion);
  }
});
