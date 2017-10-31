const Task             = require('../../../tasks/-task');
const Bash             = require('../../../tasks/bash');
const Promise          = require('rsvp').Promise;
const logger           = require('../../../utils/logger');
const fs               = require('fs');

const path             = require('path');
const getOpenCommand   = require('../../../utils/open-app-command');
const cordovaPath      = require('../utils/get-path');

module.exports = Task.extend({
  application: undefined,
  platform: undefined,
  project: undefined,

  run() {
    let projectPath, open, command;
    let cdvPath = cordovaPath(this.project);

    if (this.platform === 'ios') {
      projectPath = path.join(cdvPath, 'platforms/ios/*.xcodeproj');
    } else if (this.platform === 'android') {
      let projectFile = path.join(cdvPath, 'platforms/android/.project');

      if (fs.existsSync(projectFile)) {
        projectPath = projectFile;
      } else {
        let docLink = 'http://embercordova.com/pages/cli#open';

        logger.warn('Can\'t open IDE without a project being created. See ' +
          docLink +
          'for more info.'
        );

        projectPath = path.join(cdvPath, 'platforms/android/');
      }
    } else {
      return Promise.reject(
        'The ' + this.platform +
        ' platform is not supported. Please use \'ios\' or \'android\''
      );
    }

    logger.success('Opening app for ' + this.platform);

    command = getOpenCommand(projectPath, this.application);
    open = new Bash({
      command: command,
      options: {
        cwd: this.project.root
      }
    });

    return open.run();
  }
});
