const getPlatforms    = require('../../targets/cordova/utils/get-platforms');
const Promise         = require('rsvp').Promise;

const validPlatforms  = ['ios', 'android'];
const defaultPlatform = 'ios';

module.exports = function resolvePlatform(project, platform) {
  if (platform && !validPlatforms.includes(platform)) {
    return Promise.reject(`'${platform}' is not a valid platform`);
  }

  return getPlatforms(project).then((installedPlatforms) => {
    if (platform) {
      if (!installedPlatforms.includes(platform)) {
        let message = `'${platform}' is not an installed platform`;
        return Promise.reject(message);
      }

      return platform;
    }

    switch (installedPlatforms.length) {
      case 0:
        return Promise.reject('no platforms installed');
      case 1:
        return installedPlatforms[0];
      default:
        return defaultPlatform;
    }
  });
};
