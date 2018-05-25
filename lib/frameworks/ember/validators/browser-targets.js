/* eslint-disable max-len */
const Task            = require('../../../tasks/-task');
const rsvp            = require('rsvp');
const semver          = require('semver');
const path            = require('path');
const getCLIVersion   = require('../../../frameworks/ember/utils/get-cli-version');
const logger          = require('../../../utils/logger');
const fsUtils         = require('../../../utils/fs-utils');
const Promise         = rsvp.Promise;

const WEBSITE = 'http://corber.io/pages/frameworks/ember#configuring-browser-targets';

const CORBER_PLATFORM_REGEX = /process\.env\.CORBER_PLATFORM/;
const EMBER_CLI_MIN_VERSION = '2.13.0';
/* eslint-enable max-len */

module.exports = Task.extend({
  root: undefined,

  run() {
    let targetsPath = path.join(this.root, 'config', 'targets.js');
    let targetsJs = path.join('config', 'targets.js');
    let cliVersion = getCLIVersion(this.root);

    // targets.js doesn't exist prior to ember-cli 2.13
    if (!cliVersion || semver.lt(cliVersion, EMBER_CLI_MIN_VERSION)) {
      return Promise.resolve();
    }

    if (!fsUtils.existsSync(targetsPath)) {
      logger.warn(
        `${targetsJs} was not found. When building with ember-cli 2.13 or `
        + 'later, your project can be configured to generate platform-'
        + `optimized corber builds. See ${WEBSITE} for details.`
      );

      return Promise.resolve();
    }

    return fsUtils.read(targetsPath, { encoding: 'utf8' }).then((contents) => {
      if (!contents.match(CORBER_PLATFORM_REGEX)) {
        logger.warn(
          `${targetsJs} has not been configured for platform-optimized ` +
          `corber builds. See ${WEBSITE} for details.`
        );
      }
    });
  }
});
