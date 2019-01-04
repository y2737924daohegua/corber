const path            = require('path');
const spawn           = require('../../../utils/spawn');
const RSVP            = require('rsvp');
const Promise         = RSVP.Promise;

const findApk = function(values) {
  let files = values.split('\n');
  files = files.filter(function(file) {
    if (file.match(/apk/)) { return file; }
  });

  //return the last modified apk
  return files[files.length - 1];
};

module.exports = function(root, isDebug) {
  let buildType;
  isDebug ? buildType = 'debug' : buildType = 'release';

  //directory differs if build was with gradle vs studio
  /* eslint-disable max-len */
  let basePath = path.join(root, 'platforms', 'android');
  let gradlePath = path.join(basePath, 'build', 'outputs', 'apk', buildType);
  let studioPath = path.join(basePath, 'app', 'build', 'outputs', 'apk', buildType);
  /* eslint-enable max-len */

  let lookups = [];
  lookups.push(spawn('ls', ['-r', gradlePath]));
  lookups.push(spawn('ls', ['-r', studioPath]));

  return RSVP.allSettled(lookups).then(function(promises) {
    if (promises[0].state === 'fulfilled') {
      let apkName = findApk(promises[0].value.stdout);
      return path.join(gradlePath, apkName);
    } else if (promises[1].state === 'fulfilled') {
      let apkName = findApk(promises[1].value.stdout);
      return path.join(studioPath, apkName);
    } else {
      return Promise.reject('No apk found');
    }
  });
};
