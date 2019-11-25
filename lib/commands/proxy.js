const Command          = require('./-command');
const getCordovaPath   = require('../targets/cordova/utils/get-path');
const ValidateCordova  = require('../targets/cordova/validators/is-installed');
const logger           = require('../utils/logger');
const spawn            = require('../utils/spawn');

module.exports = Command.extend({
  name: 'proxy',
  description: 'Passes commands to Cordova CLI',

  supportedCommands: [
    'build',
    'platform',
    'platforms',
    'plugin',
    'plugins',
    'prepare'
  ],

  knownCordovaCommands: [
    'run',
    'emulate'
  ],

  onStdout: (data) => logger.stdout(data),
  onStderr: (data) => logger.stderr(data),

  validateAndRun(rawArgs) {
    let warning;

    if (this.supportedCommands.indexOf(rawArgs[0]) >= 0) {
      warning = rawArgs +
        ' run in cordova, but bypassed corber command.' +
        ` Consider running corber ${rawArgs} instead`;

    } else if (this.knownCordovaCommands.indexOf(rawArgs[0]) === -1) {
      warning = rawArgs +
        ' passed to Cordova, but is an unknown Cordova command';

    }

    if (warning !== undefined) {
      logger.warn(warning);
    }

    return this.run({}, rawArgs);
  },

  run(options, rawArgs) {
    this._super.apply(this, arguments);

    let isInstalled = new ValidateCordova({
      project: this.project
    });

    return isInstalled.run().then(() => {
      let joinedArgs = rawArgs.join(' ');
      let cdvCommand = 'cordova ' + joinedArgs;
      logger.success(`Running '${cdvCommand}'`);

      return spawn(cdvCommand, [], { shell: true }, {
        onStdout: this.onStdout,
        onStderr: this.onStderr,
        cwd: getCordovaPath(this.project)
      }).then(({ code }) => {
        if (code !== 0) {
          throw `'${cdvCommand}' failed with error code ${code}`;
        }
      });
    }).catch((e) => {
      logger.error(e);
    });
  }
});
