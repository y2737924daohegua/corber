const Task             = require('../../../tasks/-task');
const logger           = require('../../../utils/logger');
const getOpenCommand   = require('../../../utils/open-app-command');
const getCordovaPath   = require('../utils/get-path');
const getConfig        = require('../utils/get-config');
const fsUtils          = require('../../../utils/fs-utils');
const spawn            = require('../../../utils/spawn');
const Promise          = require('rsvp').Promise;
const path             = require('path');

module.exports = Task.extend({
  application: undefined,
  platform: undefined,
  project: undefined,

  onStdout: (data) => logger.stdout(data),
  onStderr: (data) => logger.stderr(data),

  run() {
    return this.getProjectFilePath(this.platform, this.project)
      .then((projectFilePath) => {
        let openCommand = getOpenCommand(projectFilePath, this.application);

        return spawn(openCommand, [], { shell: true }, {
          onStdout: this.onStdout,
          onStderr: this.onStderr,
          cwd: this.project.root
        }).then(({ code }) => {
          if (code !== 0) {
            throw `'${openCommand}' failed with error code ${code}`;
          }
        });
      });
  },

  getProjectFilePath(platform, project) {
    switch (platform) {
      case 'ios':
        return this.getIOSProjectFilePath(project);
      default:
        return Promise.reject(`Open is not supported for ${platform}`);
    }
  },

  getIOSProjectFilePath(project) {
    let cordovaPath = getCordovaPath(project);
    let iosPath = path.join(cordovaPath, 'platforms', 'ios');

    return getConfig(project).then((config) => {
      let appName = config.widget.name[0];
      let xcworkspacePath = path.join(iosPath, `${appName}.xcworkspace`);
      let xcodeprojPath = path.join(iosPath, `${appName}.xcodeproj`);

      return fsUtils.existsSync(xcworkspacePath) ?
        xcworkspacePath :
        xcodeprojPath;
    });
  }
});
