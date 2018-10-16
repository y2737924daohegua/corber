const Task            = require('./-task');
const Bash            = require('./bash');
const fsUtils         = require('../utils/fs-utils');
const logger          = require('../utils/logger');
const path            = require('path');

module.exports = Task.extend({
  rootPath: undefined,

  run(packageName, version) {
    let versionTag, command;
    if (version !== undefined) {
      versionTag = `@${version}`;
    } else {
      versionTag = '';
    }

    logger.info(`Installing ${packageName}`);

    return fsUtils.read(path.join(this.rootPath, 'yarn.lock')).then(() => {
      command = `yarn add ${packageName}${versionTag} --dev`;
      logger.info('Detected yarn.lock - using yarn');
    }, () => {
      command = `npm install ${packageName}${versionTag} --save`;
      logger.info('Did not detect a yarn.lock, using npm');
    }).then(() => {
      return new Bash({
        command: command
      }).run();
    });
  }
});
