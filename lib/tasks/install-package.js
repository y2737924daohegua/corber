const Task            = require('./-task');
const Bash            = require('./bash');
const fsUtils         = require('../utils/fs-utils');
const logger          = require('../utils/logger');
const path            = require('path');
const sortPackage     = require('sort-package-json');

module.exports = Task.extend({
  project: undefined,

  run() {
    logger.info('adding corber to devDependencies');

    let corberVersion = require('../../package.json').version;
    let packagePath = path.join(this.project.root, 'package.json');
    let packageJSON = require(packagePath);
    let devDeps = packageJSON.devDependencies || {};

    devDeps['corber'] = corberVersion;
    packageJSON.devDependencies = devDeps;

    let stringified = JSON.stringify(sortPackage(packageJSON), null, 2);
    fsUtils.write(packagePath, stringified, { encoding: 'utf8' });

    let command;
    logger.info('Preparing to install corber');
    return fsUtils.read(path.join(this.project.root, 'yarn.lock')).then(() => {
      command = 'yarn install';
      logger.info('Detected yarn.lock - using yarn');
    }, () => {
      command = 'npm install';
      logger.info('Did not detect a yarn.lock, using npm');
    }).then(() => {
      logger.info(`Running ${command}`);
      return new Bash({
        command: command
      }).run();
    });
  }
});

