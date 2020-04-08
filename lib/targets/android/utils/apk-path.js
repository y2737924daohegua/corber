const path    = require('path');
const RSVP    = require('rsvp');
const fs      = require('fs');
const logger  = require('../../../utils/logger');
const Promise = RSVP.Promise;

module.exports = function(root, opts = {}) {
  let buildType = opts.debug ? 'debug' : 'release';

  //directory differs if build was with gradle vs studio
  /* eslint-disable max-len */
  let basePath = path.join(root, 'platforms', 'android');
  let gradlePath = path.join(basePath, 'build', 'outputs', 'apk', buildType);
  let studioPath = path.join(basePath, 'app', 'build', 'outputs', 'apk', buildType);
  /* eslint-enable max-len */

  let apkPaths = [gradlePath, studioPath].reduce((arr, dir) => {
    if (!fs.existsSync(dir)) {
      return arr;
    }

    fs.readdirSync(dir).forEach((name) => {
      if (name.match(/\.apk$/i)) {
        arr.push(path.join(dir, name))
      }
    });

    return arr;
  }, []);

  if (apkPaths.length === 0) {
    return Promise.reject('No apk found')
  }

  if (apkPaths.length > 1) {
    logger.warn(`More than one apk found; using ${apkPaths[0]}`)
  }

  return Promise.resolve(apkPaths[0]);
};
