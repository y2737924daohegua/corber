const CorberError  = require('../../utils/corber-error');
const getPlatforms = require('../../targets/cordova/utils/get-platforms');

module.exports = function expandPlatforms(project, platforms = []) {
  if (!platforms.includes('added')) {
    return Promise.resolve(platforms);
  }

  return getPlatforms(project).then((addedPlatforms) => {
    if (addedPlatforms.length === 0) {
      throw new CorberError('no added platforms to generate icons for');
    }

    return addedPlatforms.reduce((arr, platform) => {
      if (arr.includes(platform)) { return arr; }
      arr.push(platform);
      return arr;
    }, platforms.filter((p) => p !== 'added'));
  });
};
